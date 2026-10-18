# TaskFlow API Notları

Temel adres: `http://localhost:3000`

## Görev işlemleri

- `POST /tasks`: Yeni görev ekler ve **201 Created** döner.
- `GET /tasks`: Görevleri listeler, **200 OK**.
- `GET /tasks/:id`: Bir görevi getirir, **200 OK**.
- `PUT /tasks/:id`: Alanları günceller, **200 OK**.
- `DELETE /tasks/:id`: Kaydı siler, **204 No Content**. Yanıt gövdesi boştur.

### Görev örneği

```json
{
  "title": "Sipariş ekranı kontrolü",
  "description": "Sipariş listesi doğru geliyor mu kontrol et.",
  "assignee": "Mert",
  "status": "pending",
  "priority": "medium",
  "projectId": 2
}
```

Zorunlu alanlar: `title`, `description`, `assignee`, `priority`, `projectId`. Örnek verilerde `projectId` olarak 1 veya 2 kullanılabilir.

`GET /tasks?status=pending`, `GET /tasks?priority=high`, `GET /tasks?assignee=Ece`, `GET /tasks?projectId=1`, `GET /tasks?q=profil`, `GET /tasks?page=1&limit=2` örnek filtrelerdir.

## Proje işlemleri

- `GET /projects`: Liste
- `GET /projects/:id`: Detay
- `POST /projects`: Yeni proje, **201**
- `PUT /projects/:id`: Güncelleme, **200**
- `DELETE /projects/:id`: Silme, **204**

Proje oluşturma örneği:

```json
{
  "name": "Mobil Uygulama",
  "description": "Yeni mobil uygulamanın API çalışmaları",
  "status": "active"
}
```

Proje durumları `active`, `completed`, `on-hold` olabilir. Bağlı görev içeren proje silinemez.

## Diğer adresler

`GET /reports/summary`: toplam proje/görev sayılarını, görev durumlarını ve öncelik dağılımını getirir.

`GET /health`: sunucunun çalışıp çalışmadığını gösterir.

Doğrulama hatalarında **400**, bulunamayan kayıtlarda **404**, bağlı görevli proje silinmek istendiğinde **409** döner.
