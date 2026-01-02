import pandas as pd
import random

apartments = [101, 102, 105, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305]
months = ['09/2025', '10/2025', '11/2025', '12/2025', '01/2026', '02/2026']

for month in months:
    month_data = []
    for apt in apartments:
        row = {
            'Ma_Can_Ho': apt,
            'Thang_Nam': month,
            'Dien_Tieu_Thu_Kwh': random.randint(150, 450),
            'He_So_Dien': 2.5,
            'Nuoc_Tieu_Thu_M3': random.randint(10, 35),
            'He_So_Nuoc': 1.75,
            'Tien_Internet': 250000
        }
        month_data.append(row)
    
    df = pd.DataFrame(month_data)
    
    file_name_safe = month.replace('/', '_')
    file_name = f"DichVu_{file_name_safe}.xlsx"
    
    df.to_excel(file_name, index=False)
    print(f"Đã tạo file: {file_name}")

print("\nHoàn tất! Đã tạo 6 file Excel riêng biệt.")