$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

Write-Host "Starting PowerShell Web Server on port $port..."

try {
    $listener.Start()
    Write-Host "Server started successfully! Access it at: http://localhost:$port/"
    
    # Run the server loop
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get requested local path
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "" -or $urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Clean path and construct file path
        $cleanUrl = $urlPath.Replace("/", "\")
        if ($cleanUrl.StartsWith("\")) {
            $cleanUrl = $cleanUrl.Substring(1)
        }
        $filePath = Join-Path "C:\Users\krush\.gemini\antigravity\scratch\portfolio" $cleanUrl
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content Type Mapping
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".jpeg" { $response.ContentType = "image/jpeg" }
                ".pdf"  { $response.ContentType = "application/pdf" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("File Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        
        $response.Close()
    }
} catch {
    Write-Error "Error starting listener: $_"
} finally {
    if ($listener) {
        $listener.Close()
    }
}
