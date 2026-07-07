# Creates the raj_* fleet of GitHub repos: raj_one ... raj_two_hundred_fifteen
# Safe to re-run: skips repos that already exist.
param(
    [int]$Count = 215,
    [string]$Owner = "wolfwdavid",
    [double]$DelaySeconds = 1.5
)

function Convert-NumberToWords([int]$n) {
    $ones = @('', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
        'seventeen', 'eighteen', 'nineteen')
    $tens = @('', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety')
    $parts = @()
    if ($n -ge 100) {
        $parts += $ones[[math]::Floor($n / 100)]
        $parts += 'hundred'
        $n = $n % 100
    }
    if ($n -ge 20) {
        $parts += $tens[[math]::Floor($n / 10)]
        $n = $n % 10
    }
    if ($n -ge 1) {
        $parts += $ones[$n]
    }
    return ($parts -join '_')
}

Write-Host "Fetching existing repos for $Owner..."
$existing = @(gh repo list $Owner --limit 400 --json name -q '.[].name')
Write-Host "Found $($existing.Count) existing repos."

$created = 0
$skipped = 0
$failed = @()

for ($i = 1; $i -le $Count; $i++) {
    $name = "raj_$(Convert-NumberToWords $i)"
    if ($existing -contains $name) {
        Write-Host "[$i/$Count] skip   $name (exists)"
        $skipped++
        continue
    }
    gh repo create "$Owner/$name" --public --add-readme --description "raj site #$i" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[$i/$Count] create $name"
        $created++
    }
    else {
        Write-Host "[$i/$Count] FAIL   $name"
        $failed += $name
    }
    Start-Sleep -Seconds $DelaySeconds
}

Write-Host ""
Write-Host "Done. created=$created skipped=$skipped failed=$($failed.Count)"
if ($failed.Count -gt 0) {
    Write-Host "Failed repos:"
    $failed | ForEach-Object { Write-Host "  $_" }
    exit 1
}
