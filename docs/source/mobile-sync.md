# Group Mobile Sync

Untuk mengambil data-data yang diperlukan oleh mobile berdasarkan tanggal terakhir kali melakukan sync dengan rumus range tanggal :
```no-highlight
Range Tanggal = Tanggal Terakhir Sync - Tanggal Hari ini
```
Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_AUTH  | T_MOBILE_SYNC

Berikut list parameter kolom **TABEL_UPDATE** :
No | Parameter 					     | Deskripsi 		 				 | MSA
--:| ------------------------------- | --------------------------------- | -----------------
 1 | finding     				     | Untuk sync tabel TR_FINDING 		 | Finding
 2 | hectare-statement/land-use 	 | Untuk sync tabel TR_HS_LAND_USE   | Hectare Statement
 3 | hectare-statement/region  		 | Untuk sync tabel TM_REGION		 | Hectare Statement
 4 | hectare-statement/comp          | Untuk sync tabel TM_COMP 		 | Hectare Statement
 5 | hectare-statement/est           | Untuk sync tabel TM_EST 			 | Hectare Statement
 6 | hectare-statement/afdeling      | Untuk sync tabel TM_AFD 			 | Hectare Statement
 7 | hectare-statement/block         | Untuk sync tabel TM_BLOCK 		 | Hectare Statement


## Mobile Sync List [/api/mobile-sync]

### Post [POST]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"TGL_MOBILE_SYNC": "2018-02-17 03:04:05",
		"TABEL_UPDATE": "hectare-statement/region"
	}

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": {}
	}
+ Response 403 (text/plain)
	Forbidden

+ Response 404 (application/json)
	{
		"status": false,
		"message": "Error! Data gagal diproses",
		"data": {}
	}

+ Response 500 (application/json)
	{
		"status": false,
		"message": "Error! Terjadi kesalahan dalam pembuatan data",
		"data": {}
	}