# TaskFlow - Proje Tanıtımı

## Projenin amacı

Bu projede, bir yazılım şirketinin yürüttüğü projeleri ve ekip üyelerine atanan görevleri takip etmek için backend geliştirdim. Ekipte farklı projelerde çalışan kişiler bulunabiliyor. Görevlerin kimde olduğu, hangi proje için yapıldığı, ne kadar öncelikli olduğu ve tamamlanıp tamamlanmadığı tek bir API üzerinden görülebiliyor.

Uygulamanın adı TaskFlow. Arayüz yerine HTTP istekleriyle çalışan bir REST API hazırladım.

## Kullanım senaryosu

Örneğin yazılım ekibinin Müşteri Portalı ve E-Ticaret API adında iki projesi olduğunu düşünelim. Müşteri Portalı projesine giriş sayfasının entegrasyonu için bir görev eklenebilir. Bu görev Ayşe'ye atanabilir ve yüksek öncelikli olarak kaydedilebilir. Ekip göreve başladığında durumunu `in-progress`, bitirdiğinde `completed` olarak değiştirebilir.

Görevler proje, sorumlu kişi, öncelik ve durum bilgilerine göre filtrelenebilir. Yönetici de özet rapordan hangi durumda kaç görev olduğunu görebilir.

## Temel işlemler

Görevler için ekleme, listeleme, detay getirme, güncelleme ve silme işlemleri bulunuyor. Aynı CRUD işlemleri projeler için de uygulanıyor. Silinmek istenen projenin bağlı görevleri varsa bu işlem engelleniyor.

Kayıtlarda görev başlığı, açıklaması, atanan kişi, durum, öncelik ve proje numarası bulunuyor. Otomatik oluşturulma ve güncellenme tarihleri de tutuluyor.

## Kullanılan teknoloji

- Node.js ve Express.js
- REST API ve JSON veri formatı
- Express Router
- Logger middleware
- Veri kontrolü ve hata yönetimi
- JSON dosyalarında veri saklama
- Postman ile HTTP isteklerini test etme

Kodda route, controller, service ve middleware dosyaları ayrı klasörlere yerleştirildi. Logger her isteğin yöntemini, adresini ve zamanını terminale yazıyor. Eksik ya da yanlış alanlar gönderildiğinde API uygun hata kodu döndürüyor.

## Test yaklaşımı

Önce POST isteğiyle bir görev oluşturuluyor. Sonra GET ile görev listesi ve kayıt detayı kontrol ediliyor. PUT ile görev güncelleniyor ve en son DELETE ile siliniyor. Postman'de beklenen başarılı yanıtlar sırasıyla 201, 200, 200, 200 ve 204.

Geliştirme ortamında kurulum için `npm install`, çalıştırmak için `npm start` yeterlidir. Test komutu `npm test`.

Kaynak kodlar, örnek veriler ve Postman koleksiyonu GitHub'daki TaskFlow deposunda yer alıyor.
