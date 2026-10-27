Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot '..\extension\icons'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

foreach ($size in 16, 32, 48, 128) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::Transparent)

  $padding = [Math]::Max(1, [Math]::Round($size / 8))
  $markSize = $size - (2 * $padding)
  $background = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 24, 27, 23))
  $border = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 214, 202, 175), [Math]::Max(1, $size / 64))
  $graphics.FillRectangle($background, $padding, $padding, $markSize, $markSize)
  $graphics.DrawRectangle($border, $padding, $padding, $markSize - 1, $markSize - 1)

  $fontSize = [Math]::Max(8, $size * 0.54)
  $font = New-Object System.Drawing.Font('Georgia', $fontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $foreground = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString('T', $font, $foreground, (New-Object System.Drawing.RectangleF($padding, $padding, $markSize, $markSize)), $format)

  $path = Join-Path $outputDirectory "icon-$size.png"
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $format.Dispose()
  $foreground.Dispose()
  $font.Dispose()
  $border.Dispose()
  $background.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}
