<# desk-solo.ps1 (2 Nov a16): desk-only rehearsal. Desk runs genesis (coordinator + broker) and the only sender, all against
   the desk TN10 kaspad (ws 127.0.0.1:17210). Mini only counts (counter.cjs, read-only). Never touches any kaspad. TESTNET-10 ONLY. #>
param([string]$Run, [string]$Kit, [string]$BuilderRoots, [int]$RecoveryMin = 20)
$raw = gc "$Run\config.json" -Raw; $cfg = $raw | ConvertFrom-Json
$END = [DateTimeOffset]::Parse([regex]::Match($raw, '"end_utc":\s*"([^"]+)"').Groups[1].Value).UtcDateTime
$T0 = [DateTimeOffset]::Parse([regex]::Match($raw, '"from":\s*"([^"]+)"').Groups[1].Value).UtcDateTime
$ph = { param($m) "$((Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')) $m" | Add-Content "$Run\logs\phase.log" }
if ($PSVersionTable.PSVersion.Major -lt 7) { & $ph "LAUNCH_ABORT reason=pwsh"; exit 6 }
$env:STORM_CONFIG = "$Run\config.json"; $s = @{ WorkingDirectory = $Kit; WindowStyle = 'Hidden'; PassThru = $true }
& $ph "SOLO_ARMED start=$($T0.ToString('o')) end=$($END.ToString('o'))"
$pe = Start-Process node -ArgumentList "$Kit\post-end.mjs --sdk $($cfg.kaspa_sdk) --url ws://127.0.0.1:17210 --label desk --out $Run\logs --end $($END.ToString('yyyy-MM-ddTHH:mm:ssZ')) --minutes $RecoveryMin" @s -RedirectStandardOutput "$Run\out\post-end.out" -RedirectStandardError "$Run\out\post-end.err"
$b = Start-Process node -ArgumentList 'builder-broker.mjs' @s -RedirectStandardOutput "$Run\out\broker.out" -RedirectStandardError "$Run\out\broker.err"; Start-Sleep 3
$c = Start-Process node -ArgumentList 'coordinator.mjs' @s -RedirectStandardOutput "$Run\out\coord.out" -RedirectStandardError "$Run\out\coord.err"
& $ph "WATCH broker=$($b.Id) coord=$($c.Id) post_end=$($pe.Id)"
while ($true) { $n = (sls -Path "$Run\logs\phase.log" -Pattern ' (GENESIS|FAMILY_DROP) ' -ea 0 | measure).Count; if ($n -ge $cfg.families.Count -or $c.HasExited) { break }; Start-Sleep -Milliseconds 250 }
if ((sls -Path "$Run\logs\phase.log" -Pattern 'FAMILY_DROP' -Quiet) -or $c.HasExited) { & $ph "LAUNCH_ABORT reason=genesis"; New-Item "$Run\control\STOP" -Force | Out-Null; exit 3 }
& node "$Kit\preflight.mjs" *> "$Run\out\preflight.txt"; & $ph "PREFLIGHT exit=$LASTEXITCODE"
if ($LASTEXITCODE -ne 0) { & $ph "LAUNCH_ABORT reason=preflight"; New-Item "$Run\control\STOP" -Force | Out-Null; exit 4 }
$env:STORM_BUILDER_DIRECT = '1'; $env:STORM_ROOT = Join-Path $BuilderRoots 'desk'
$p = Start-Process node -ArgumentList "sender.mjs --label desk --source self --node ws://127.0.0.1:17210 --key $($cfg.lanes.desk.key)" @s -RedirectStandardOutput "$Run\out\sender-desk.out" -RedirectStandardError "$Run\out\sender-desk.err"
& $ph "SENDER desk pid=$($p.Id)"
while ([DateTime]::UtcNow -lt $T0) { Start-Sleep -Milliseconds 200 }
& $ph "START senders=desk families=$($cfg.families.Count) steps=$($cfg.schedule.Count)"
while ([DateTime]::UtcNow -lt $END) { Start-Sleep 1; if ($p.HasExited) { & $ph "PROC_EXIT sender before_end"; break } }
& $ph "END reason=window"
Start-Sleep 60; & $ph "SENDERS_EXITED left=$([int](-not $p.HasExited))"
foreach ($at in 75, 180, 360) { while ([DateTime]::UtcNow -lt $END.AddSeconds($at)) { Start-Sleep 1 }
  $o = & node "$Kit\sweep-ours.mjs" "$Run\config.json" ws://127.0.0.1:17210 ws://127.0.0.1:17299 --extra "$Run\private\genesis-addrs.txt" --apply --label "end+$at" --log "$Run\logs\sweep.jsonl" 2>&1 | select -Last 1
  & $ph "SWEEP at=END+${at}s out=$(("$o" -replace '[0-9a-f]{64}','<h>').Substring(0,[Math]::Min(120,"$o".Length)))" }
while ([DateTime]::UtcNow -lt $END.AddMinutes(10).AddSeconds(5)) { Start-Sleep 5 }
foreach ($m in @(@('desk','ws://127.0.0.1:17210'),@('mini','ws://127.0.0.1:17299'))) { $o = & node "$Kit\mempool-ro.mjs" "$Run\config.json" $m[1] --extra "$Run\private\genesis-addrs.txt" --wait 0 --label $m[0] --pre "$Run\private\ours-pre-$($m[0]).txt" --log "$Run\logs\mempool-ours.jsonl" 2>&1 | select -Last 1
  & $ph "CRIT9 node=$($m[0]) ours=$([regex]::Match("$o",'"ours":(\d+)').Groups[1].Value) ours_new=$([regex]::Match("$o",'"ours_new":(\d+)').Groups[1].Value)" }
while ([DateTime]::UtcNow -lt $END.AddMinutes($RecoveryMin)) { Start-Sleep 5 }
foreach ($x in $b, $c, $pe) { if (-not $x.HasExited) { Stop-Process -Id $x.Id -Force -ea 0 } }
& $ph "RECOVERY_DONE minutes=$RecoveryMin"
