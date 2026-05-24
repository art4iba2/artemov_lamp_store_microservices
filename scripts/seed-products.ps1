
$ErrorActionPreference = "Stop"

$Products = @(
    @{
        title = "Светодиодная лампа LED A60"
        description = "Экономичная светодиодная лампа для дома."
        price = 180
        brightness = 800
        stock = 10
        images = @()
    },
    @{
        title = "Лампа LED свеча"
        description = "Подходит для люстр и декоративных светильников."
        price = 150
        brightness = 600
        stock = 15
        images = @()
    },
    @{
        title = "Лампа энергосберегающая"
        description = "Лампа с высокой яркостью и низким энергопотреблением."
        price = 220
        brightness = 1000
        stock = 8
        images = @()
    }
)

foreach ($Product in $Products) {
    $Json = $Product | ConvertTo-Json -Depth 5
    Invoke-RestMethod -Uri "http://localhost:8001/api/products" -Method Post -ContentType "application/json" -Body $Json
}

Write-Host "Тестовые товары добавлены."
