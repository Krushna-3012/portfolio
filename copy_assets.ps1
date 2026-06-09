$srcDir = "C:\Users\krush\.gemini\antigravity\brain\e20b42ca-5da4-4ff4-8977-da45f919dbfd"
$destDir = "C:\Users\krush\.gemini\antigravity\scratch\portfolio\assets\images"

# Ensure destination exists
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir
}

# Mapping of generated source files to destination names
$files = @{
    "designer_profile_1780648780689.png" = "profile.png"
    "portfolio_social_media_1780648866104.png" = "social-media.png"
    "portfolio_branding_1780648881953.png" = "branding.png"
    "portfolio_poster_1780648898783.png" = "poster.png"
    "portfolio_marketing_1780648920128.png" = "marketing.png"
    "portfolio_festival_1780648942106.png" = "festival.png"
}

foreach ($srcFile in $files.Keys) {
    $srcPath = Join-Path $srcDir $srcFile
    $destPath = Join-Path $destDir $files[$srcFile]
    
    if (Test-Path $srcPath) {
        Copy-Item -Path $srcPath -Destination $destPath -Force
        Write-Host "Copied $srcFile to $destPath"
    } else {
        Write-Warning "Source file not found: $srcPath"
    }
}
