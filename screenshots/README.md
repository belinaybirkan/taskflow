# Postman test ekran görüntüleri

Görev CRUD testleri tamamlandıktan sonra bu klasöre beş gerçek ekran görüntüsü eklenir:

| Dosya | Test | Beklenen yanıt |
| --- | --- | --- |
| `01-post-create.png` | POST /tasks | 201 Created |
| `02-get-list.png` | GET /tasks | 200 OK |
| `03-get-detail.png` | GET /tasks/:id | 200 OK |
| `04-put-update.png` | PUT /tasks/:id | 200 OK |
| `05-delete.png` | DELETE /tasks/:id | 204 No Content |

Önce POST yapılmalı. Postman koleksiyonu oluşturulan kaydın ID'sini kendisi saklar. DELETE isteği en son çalıştırılır. 204 yanıtında body boş olur.
