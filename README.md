# TaskFlow

Görev ve Proje Yönetim Sistemi REST API projesi

TaskFlow, yazılım ekiplerinin yürüttüğü projeleri ve bu projelerdeki görevleri takip etmek için geliştirdiğim bir backend uygulamasıdır. Projelere görev eklenebilir, görevlerin sorumluları ve öncelikleri belirlenebilir, çalışma durumu güncellenebilir.

Proje Node.js ve Express.js ile hazırlandı. Veriler JSON dosyalarında saklanıyor. Bu sürümde ayrı bir veritabanı veya arayüz bulunmuyor.

## Kurulum

Bilgisayarda Node.js 18 veya üzeri kurulu olmalı.

```bash
git clone https://github.com/belinaybirkan/taskflow.git
cd taskflow
npm install
npm start
```

Sunucu `http://localhost:3000` adresinden çalışır. Kontrol için `http://localhost:3000/health` adresini açabilirsin.

## API adresleri

| Yöntem | Adres | İşlem |
| --- | --- | --- |
| GET | `/tasks` | Görevleri listele |
| GET | `/tasks/:id` | Görev detayını getir |
| POST | `/tasks` | Yeni görev ekle |
| PUT | `/tasks/:id` | Görev güncelle |
| DELETE | `/tasks/:id` | Görev sil |
| GET | `/projects` | Projeleri listele |
| GET | `/projects/:id` | Proje detayını getir |
| POST | `/projects` | Yeni proje ekle |
| PUT | `/projects/:id` | Proje güncelle |
| DELETE | `/projects/:id` | Proje sil |
| GET | `/reports/summary` | Görev istatistikleri |
| GET | `/health` | Sunucu kontrolü |

Örnek görev oluşturma isteği, `POST /tasks`:

```json
{
  "title": "Ana sayfa testlerini tamamla",
  "description": "Giriş ekranını ve yönlendirmeleri kontrol et.",
  "assignee": "Ece",
  "priority": "high",
  "projectId": 1
}
```

Görev oluştururken `title`, `description`, `assignee`, `priority`, `projectId` zorunludur. `status` değeri `pending`, `in-progress` veya `completed` olabilir. Öncelik ise `low`, `medium` veya `high` olmalıdır.

## Ek özellikler

Görevler `status`, `priority`, `assignee` ve `projectId` ile filtrelenebilir. `q` ile arama, `page` ve `limit` ile sayfalama yapılabilir. `/reports/summary` toplam görev sayısını ve durumlara göre dağılımını döndürür.

Projeler de ayrı olarak eklenebilir, güncellenebilir ve silinebilir. Bir projeye bağlı görev varsa yanlışlıkla silinmesini önlemek için `409 Conflict` yanıtı döner.

Gelen istekler logger middleware üzerinden yöntem, adres ve zaman bilgileriyle terminale yazılır.

## Test

```bash
npm test
```

Sunucu açıkken başka bir terminalde:

```bash
npm run test:http
```

Postman'de [TaskFlow koleksiyonunu](postman/TaskFlow.postman_collection.json) **Import** ile içe aktar. `01 - Zorunlu Görev CRUD Testleri` klasöründeki beş isteği sırayla gönder. Beklenen durum kodları sırasıyla **201, 200, 200, 200, 204**.

Postman testlerinden alınan gerçek görüntüler `screenshots/` klasörüne eklenecektir. Eski SignalGap görüntüleri bu proje için kullanılmamalıdır.

## Klasörler

`src/routes/` endpoint yönlendirmeleri, `src/controllers/` istek ve yanıtlar, `src/services/` iş mantığı, `src/middleware/` logger ve hata yönetimi, `src/data/` JSON verileri, `tests/` test dosyaları, `postman/` API test koleksiyonu.

Detaylı örnekler için [API notlarını](docs/API.md) inceleyebilirsin.
