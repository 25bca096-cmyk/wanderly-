$files = @(
    "src/js/destinations-data.js",
    "src/js/trips-store.js",
    "src/js/booking-engine.js",
    "src/js/ai-engine.js",
    "src/js/app.js",
    "src/css/style.css",
    "public/images/wanderly-logo.png"
)

foreach ($f in $files) {
    try {
        $res = Invoke-WebRequest -Uri "http://localhost:3000/$f" -UseBasicParsing
        Write-Host "OK: $f - Status: $($res.StatusCode) - Bytes: $($res.RawContentLength)"
    } catch {
        Write-Host "FAIL: $f - Error: $_"
    }
}
