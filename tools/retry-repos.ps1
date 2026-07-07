# Waits out GitHub's secondary rate limit, then finishes creating the raj_* repo fleet.
# Runs detached; progress is logged to tools\new-repos-retry.log
$root = "C:\Users\Mkaru\Documents\Hello_World\hugginface_profile\Websites\raj"
$log = Join-Path $root 'tools\new-repos-retry.log'

"=== retry started $(Get-Date) ===" | Out-File $log

# probe with the first missing repo until the block lifts (this creates it on success)
$attempt = 0
while ($true) {
    $attempt++
    gh repo create wolfwdavid/raj_one_hundred_fifty_one --public --add-readme --description "raj site #151" 2>&1 |
        Out-File $log -Append
    if ($LASTEXITCODE -eq 0) {
        "probe succeeded on attempt $attempt at $(Get-Date) — block lifted" | Out-File $log -Append
        break
    }
    if ($attempt -ge 24) {
        "giving up after $attempt probes (2 hours) at $(Get-Date)" | Out-File $log -Append
        exit 1
    }
    "still blocked (attempt $attempt) at $(Get-Date); sleeping 5 min" | Out-File $log -Append
    Start-Sleep -Seconds 300
}

# slower pace this time to stay under the secondary limit
& (Join-Path $root 'tools\new-repos.ps1') -DelaySeconds 3 2>&1 | Out-File $log -Append
"=== retry finished $(Get-Date) exit=$LASTEXITCODE ===" | Out-File $log -Append
