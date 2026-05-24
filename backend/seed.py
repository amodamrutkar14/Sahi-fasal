from database import SessionLocal, engine, Base
from models import Crop

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have crops
    if db.query(Crop).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    crops_data = [
        # 1. Wheat
        Crop(crop_name_en="Wheat", crop_name_mr="गहू", suitable_soils="Alluvial,Black,Loamy", suitable_seasons="Rabi", water_requirement="Medium", min_temp=10, max_temp=25, min_rainfall=50, max_rainfall=100, profit_per_acre=25000, reason_en="Good winter crop with stable demand.", reason_mr="चांगले हिवाळी पीक, मागणी स्थिर."),
        # 2. Rice
        Crop(crop_name_en="Rice", crop_name_mr="भात", suitable_soils="Alluvial,Loamy", suitable_seasons="Kharif", water_requirement="High", min_temp=20, max_temp=35, min_rainfall=100, max_rainfall=200, profit_per_acre=30000, reason_en="High yield in high water areas.", reason_mr="जास्त पाण्याच्या ठिकाणी उत्तम पीक."),
        # 3. Jowar
        Crop(crop_name_en="Jowar", crop_name_mr="ज्वारी", suitable_soils="Black,Sandy,Loamy", suitable_seasons="Kharif,Rabi", water_requirement="Low", min_temp=25, max_temp=35, min_rainfall=30, max_rainfall=65, profit_per_acre=15000, reason_en="Drought resistant, suitable for dry areas.", reason_mr="दुष्काळ प्रतिरोधक, कोरड्या भागांसाठी अनुकूल."),
        # 4. Bajra
        Crop(crop_name_en="Bajra", crop_name_mr="बाजरी", suitable_soils="Sandy,Black", suitable_seasons="Kharif", water_requirement="Low", min_temp=25, max_temp=35, min_rainfall=25, max_rainfall=50, profit_per_acre=12000, reason_en="Highly drought tolerant.", reason_mr="अत्यंत दुष्काळ सहनशील."),
        # 5. Tur Dal
        Crop(crop_name_en="Tur Dal (Pigeon Pea)", crop_name_mr="तूर डाळ", suitable_soils="Red,Black,Loamy", suitable_seasons="Kharif", water_requirement="Medium", min_temp=26, max_temp=30, min_rainfall=60, max_rainfall=90, profit_per_acre=40000, reason_en="High market value, nitrogen fixing.", reason_mr="चांगली बाजारभाव, मातीचा पोत सुधारतो."),
        # 6. Chickpea
        Crop(crop_name_en="Chickpea", crop_name_mr="हरभरा", suitable_soils="Black,Loamy", suitable_seasons="Rabi", water_requirement="Medium", min_temp=15, max_temp=25, min_rainfall=40, max_rainfall=70, profit_per_acre=28000, reason_en="Great for rotation in winter.", reason_mr="हिवाळ्यात चांगला पर्याय."),
        # 7. Onion
        Crop(crop_name_en="Onion", crop_name_mr="कांदा", suitable_soils="Black,Red", suitable_seasons="Kharif,Rabi", water_requirement="Medium", min_temp=15, max_temp=30, min_rainfall=50, max_rainfall=75, profit_per_acre=60000, reason_en="High potential profit, staple vegetable.", reason_mr="मोठा नफा मिळवण्याची क्षमता."),
        # 8. Tomato
        Crop(crop_name_en="Tomato", crop_name_mr="टोमॅटो", suitable_soils="Red,Loamy,Sandy", suitable_seasons="Kharif,Rabi,Zaid", water_requirement="Medium", min_temp=18, max_temp=30, min_rainfall=40, max_rainfall=60, profit_per_acre=75000, reason_en="Fast growing and profitable.", reason_mr="जलद वाढणारे आणि फायदेशीर."),
        # 9. Sugarcane
        Crop(crop_name_en="Sugarcane", crop_name_mr="ऊस", suitable_soils="Black,Alluvial", suitable_seasons="Kharif", water_requirement="High", min_temp=25, max_temp=35, min_rainfall=100, max_rainfall=250, profit_per_acre=90000, reason_en="Cash crop with guaranteed purchase.", reason_mr="खात्रीशीर खरेदी असलेले रोकड पीक."),
        # 10. Cotton
        Crop(crop_name_en="Cotton", crop_name_mr="कापूस", suitable_soils="Black", suitable_seasons="Kharif", water_requirement="Medium", min_temp=20, max_temp=32, min_rainfall=50, max_rainfall=100, profit_per_acre=50000, reason_en="Major cash crop, best for black soil.", reason_mr="काळी मातीसाठी उत्तम रोकड पीक."),
        # 11. Soybean
        Crop(crop_name_en="Soybean", crop_name_mr="सोयाबीन", suitable_soils="Black,Loamy", suitable_seasons="Kharif", water_requirement="Medium", min_temp=25, max_temp=30, min_rainfall=50, max_rainfall=90, profit_per_acre=45000, reason_en="High demand for oil and meal.", reason_mr="तेलासाठी आणि पेंडीसाठी मोठी मागणी."),
        # 12. Groundnut
        Crop(crop_name_en="Groundnut", crop_name_mr="भुईमूग", suitable_soils="Sandy,Red", suitable_seasons="Kharif", water_requirement="Medium", min_temp=25, max_temp=35, min_rainfall=50, max_rainfall=100, profit_per_acre=35000, reason_en="Good for sandy soils.", reason_mr="वाळूमिश्रित मातीसाठी उत्तम."),
        # 13. Maize
        Crop(crop_name_en="Maize", crop_name_mr="मका", suitable_soils="Alluvial,Red,Loamy", suitable_seasons="Kharif,Zaid", water_requirement="Medium", min_temp=20, max_temp=30, min_rainfall=50, max_rainfall=100, profit_per_acre=20000, reason_en="Versatile, good for poultry feed.", reason_mr="बहुउद्देशीय, कुक्कुटपालनासाठी उत्तम."),
        # 14. Sunflower
        Crop(crop_name_en="Sunflower", crop_name_mr="सूर्यफूल", suitable_soils="Black,Loamy", suitable_seasons="Rabi,Zaid", water_requirement="Medium", min_temp=20, max_temp=30, min_rainfall=40, max_rainfall=60, profit_per_acre=30000, reason_en="Short duration, high oil value.", reason_mr="कमी कालावधीचे, तेलासाठी उपयुक्त."),
        # 15. Turmeric
        Crop(crop_name_en="Turmeric", crop_name_mr="हळद", suitable_soils="Alluvial,Black", suitable_seasons="Kharif", water_requirement="High", min_temp=25, max_temp=35, min_rainfall=100, max_rainfall=150, profit_per_acre=100000, reason_en="Very high value spice crop.", reason_mr="अत्यंत मौल्यवान मसाला पीक.")
    ]
    
    for c in crops_data:
        db.add(c)
        
    db.commit()
    print("Database seeded successfully with 15 crops.")
    db.close()

if __name__ == "__main__":
    seed_db()
