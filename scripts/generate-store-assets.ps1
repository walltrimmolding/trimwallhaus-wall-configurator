Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot '..\..\..\outputs\chrome-web-store-assets'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$dark = [System.Drawing.Color]::FromArgb(255, 24, 27, 23)
$cream = [System.Drawing.Color]::FromArgb(255, 246, 242, 232)
$sage = [System.Drawing.Color]::FromArgb(255, 204, 215, 203)
$green = [System.Drawing.Color]::FromArgb(255, 54, 94, 73)
$gold = [System.Drawing.Color]::FromArgb(255, 179, 137, 70)
$white = [System.Drawing.Color]::White

function New-Canvas([int]$width, [int]$height) {
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear($cream)
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

function Draw-BrandMark($graphics, [float]$x, [float]$y, [float]$size) {
  $background = New-Object System.Drawing.SolidBrush($dark)
  $border = New-Object System.Drawing.Pen($gold, [Math]::Max(1, $size / 40))
  $foreground = New-Object System.Drawing.SolidBrush($white)
  $font = New-Object System.Drawing.Font('Georgia', ($size * 0.58), [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.FillRectangle($background, $x, $y, $size, $size)
  $graphics.DrawRectangle($border, $x, $y, $size - 1, $size - 1)
  $graphics.DrawString('T', $font, $foreground, (New-Object System.Drawing.RectangleF($x, $y, $size, $size)), $format)
  $format.Dispose()
  $font.Dispose()
  $foreground.Dispose()
  $border.Dispose()
  $background.Dispose()
}

function Draw-WallPreview($graphics, [float]$x, [float]$y, [float]$width, [float]$height) {
  $wallBrush = New-Object System.Drawing.SolidBrush($sage)
  $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 24, 27, 23))
  $trimPen = New-Object System.Drawing.Pen($white, [Math]::Max(3, $height / 55))
  $trimPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $graphics.FillRectangle($shadowBrush, $x + 7, $y + 8, $width, $height)
  $graphics.FillRectangle($wallBrush, $x, $y, $width, $height)
  $marginX = $width * 0.09
  $marginY = $height * 0.16
  $gap = $width * 0.04
  $frameWidth = ($width - (2 * $marginX) - (2 * $gap)) / 3
  for ($i = 0; $i -lt 3; $i++) {
    $frameX = $x + $marginX + ($i * ($frameWidth + $gap))
    $graphics.DrawRectangle($trimPen, $frameX, $y + $marginY, $frameWidth, $height - (2 * $marginY))
  }
  $trimPen.Dispose()
  $shadowBrush.Dispose()
  $wallBrush.Dispose()
}

function Save-SmallPromo {
  $canvas = New-Canvas 440 280
  $bitmap = $canvas.Bitmap
  $graphics = $canvas.Graphics
  $darkBrush = New-Object System.Drawing.SolidBrush($dark)
  $greenBrush = New-Object System.Drawing.SolidBrush($green)
  $headline = New-Object System.Drawing.Font('Georgia', 26, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $subhead = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $buttonFont = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.FillRectangle($darkBrush, 0, 0, 440, 82)
  Draw-BrandMark $graphics 24 18 46
  $graphics.DrawString('Trim Wall Haus', $subhead, (New-Object System.Drawing.SolidBrush($white)), 82, 32)
  $graphics.DrawString('Plan the wall.', $headline, $darkBrush, 24, 102)
  $graphics.DrawString('Know what to order.', $headline, $darkBrush, 24, 136)
  $graphics.DrawString('LAYOUT  ·  SPACING  ·  CUT LIST', $subhead, $greenBrush, 25, 188)
  Draw-WallPreview $graphics 300 104 115 105
  $pill = New-Object System.Drawing.SolidBrush($green)
  $graphics.FillRectangle($pill, 24, 230, 190, 30)
  $graphics.DrawString('FREE WALL CALCULATOR', $buttonFont, (New-Object System.Drawing.SolidBrush($white)), 37, 238)
  $pill.Dispose()
  $buttonFont.Dispose()
  $subhead.Dispose()
  $headline.Dispose()
  $greenBrush.Dispose()
  $darkBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Save((Join-Path $outputDirectory 'small-promo-440x280.png'), [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function Save-Marquee {
  $canvas = New-Canvas 1400 560
  $bitmap = $canvas.Bitmap
  $graphics = $canvas.Graphics
  $darkBrush = New-Object System.Drawing.SolidBrush($dark)
  $greenBrush = New-Object System.Drawing.SolidBrush($green)
  $headline = New-Object System.Drawing.Font('Georgia', 64, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $brandFont = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $detailFont = New-Object System.Drawing.Font('Arial', 22, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  $labelFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  Draw-BrandMark $graphics 72 62 72
  $graphics.DrawString('TRIM WALL HAUS', $brandFont, $darkBrush, 165, 86)
  $graphics.DrawString('Plan the wall.', $headline, $darkBrush, 72, 180)
  $graphics.DrawString('Know what to order.', $headline, $darkBrush, 72, 255)
  $graphics.DrawString('Picture frame  ·  Board & batten  ·  Accent grid  ·  Wainscoting', $detailFont, $greenBrush, 76, 356)
  $graphics.FillRectangle($greenBrush, 76, 414, 360, 48)
  $graphics.DrawString('FREE WALL MOLDING CALCULATOR', $labelFont, (New-Object System.Drawing.SolidBrush($white)), 96, 426)
  Draw-WallPreview $graphics 865 105 445 330
  $goldPen = New-Object System.Drawing.Pen($gold, 4)
  $graphics.DrawLine($goldPen, 810, 105, 810, 435)
  $goldPen.Dispose()
  $labelFont.Dispose()
  $detailFont.Dispose()
  $brandFont.Dispose()
  $headline.Dispose()
  $greenBrush.Dispose()
  $darkBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Save((Join-Path $outputDirectory 'marquee-1400x560.png'), [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

Save-SmallPromo
Save-Marquee
