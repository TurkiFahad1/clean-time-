document.addEventListener('DOMContentLoaded', () => {

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const headerLogo = document.querySelector('header .logo'); // تحديد شعار الهيدر

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        mainContent.classList.remove('hidden');
        mainContent.style.animation = 'fadeIn 1s';

        // !! إضافة: إزالة الفئة لتصغير الشعار !!
        if (headerLogo) {
            // تأخير بسيط جداً (50ms) لضمان أن المتصفح قد عرض العنصر قبل بدء الانتقال
            setTimeout(() => {
                 headerLogo.classList.remove('logo-large-initial');
            }, 50); 
        }

        setTimeout(() => { splashScreen.style.display = 'none'; }, 800); // إخفاء شاشة البداية بعد انتهاء التلاشي
    }, 2500); // مدة عرض شاشة البداية

    const services = [
        { name: 'الموكيت', price: 7, unit: 'm2', description: 'تنظيف عميق للموكيت والسجاد بأحدث الأجهزة والمواد الآمنة.', icon: 'https://img.icons8.com/ios/80/ffffff/rug.png' },
        { name: 'الكنب', price: 20, unit: 'm', description: 'إزالة تامة للبقع والروائح الكريهة ليعود الكنب كأنه جديد.', icon: 'https://img.icons8.com/ios/80/ffffff/sofa.png' },
        { name: 'الجلسة العربي', price: 10, unit: 'm', description: 'نظافة وتعقيم للجلسات العربية مع الحفاظ على ألوانها الزاهية.', icon: 'https://img.icons8.com/ios/80/ffffff/cushion.png' },
        { name: 'مكيف شباك', price: 35, unit: 'qty', description: 'تنظيف شامل للوحدة الداخلية والخارجية لتحسين الأداء.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner.png' },
        { name: 'مكيف اسبليت', price: 50, unit: 'qty', description: 'غسيل وصيانة فلاتر ووحدات مكيفات الاسبليت لضمان هواء نقي.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner--v1.png' },
        { name: 'ستائر', price: 12.5, unit: 'm2', description: 'تنظيف الستائر بالبخار وهي في مكانها بدون فك وتركيب.', icon: 'https://img.icons8.com/ios/80/ffffff/curtain.png' },
    ];

    const servicesGrid = document.querySelector('.services-grid');
    if (servicesGrid) { 
        services.forEach(service => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'service-card';
            cardWrapper.innerHTML = `
                <div class="service-card-content">
                    <img src="${service.icon}" alt="${service.name}">
                    <h3>${service.name}</h3>
                    <p>${service.description}</p>
                    <button class="animated-btn" data-service='${JSON.stringify(service)}'>
                        <span class="circle" aria-hidden="true"><span class="icon arrow"></span></span>
                        <span class="button-text">احسب السعر</span>
                    </button>
                </div>
            `;
            servicesGrid.appendChild(cardWrapper);
        });
    }
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    if (servicesGrid) { 
        servicesGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.animated-btn');
            if (button) {
                const service = JSON.parse(button.dataset.service);
                openModal(service);
            }
        });
    }

    if (closeButton) { 
        closeButton.onclick = () => modal.style.display = 'none';
    }
    if (modal) { 
        window.onclick = (e) => { if (e.target == modal) { modal.style.display = 'none'; } };
    }

    function openModal(service) {
        let formInputs = '';
        if (service.unit === 'm2') {
            formInputs = `<div class="input-group"><label class="input-label" for="width">العرض (متر)</label><input class="input-field" type="number" id="width" placeholder="مثال: 4"></div><div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 5"></div>`;
        } else if (service.unit === 'm') {
             formInputs = `<div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 7"></div>`;
        } else if (service.unit === 'qty') {
             formInputs = `<div class="input-group"><label class="input-label" for="quantity">العدد</label><input class="input-field" type="number" id="quantity" value="1" min="1"></div>`;
        }

        modalBody.innerHTML = `
            <div class="calculator-form"><h3>حاسبة سعر ${service.name}</h3>${formInputs}
                <div class="price-display"><h4>السعر التقريبي: <span id="price-result">0</span> ريال</h4><p>هذا السعر تقريبي وقد يختلف بعد المعاينة</p></div>
            </div>
            <hr class="hidden">
            <div class="booking-form hidden">
                <h4>ممتاز! هل تريد حجز موعدك الآن؟</h4>
                <form id="booking-form-actual">
                    <div class="input-group"><label class="input-label">الاسم الكامل</label><input class="input-field" type="text" name="name" required></div>
                    <div class="input-group"><label class="input-label">رقم الجوال</label><input class="input-field" type="tel" name="phone" required></div>
                    <div class="input-group"><label class="input-label">التاريخ (اختياري)</label><input class="input-field" type="date" name="date"></div>
                    <button type="submit" class="animated-btn">
                        <span class="circle" aria-hidden="true"><span class="icon arrow"></span></span>
                        <span class="button-text">تأكيد الحجز</span>
                    </button>
                </form>
            </div>`;
        modal.style.display = 'flex';
        setupCalculator(service);
        setupBookingForm();
    }
    
    function setupCalculator(service) {
        const priceResult = document.getElementById('price-result');
        const inputs = modalBody.querySelectorAll('.input-field[type="number"]');
        const bookingSection = modalBody.querySelector('.booking-form');
        const separator = modalBody.querySelector('hr');
        const bookingSectionHeight = bookingSection.scrollHeight + 100;

        inputs.forEach(input => {
            input.oninput = () => {
                let price = 0;
                 if (service.unit === 'm2') {
                    const width = parseFloat(document.getElementById('width').value) || 0;
                    const length = parseFloat(document.getElementById('length').value) || 0;
                    price = width * length * service.price;
                } else if (service.unit === 'm') {
                    const length = parseFloat(document.getElementById('length').value) || 0;
                    price = length * service.price;
                } else if (service.unit === 'qty') {
                    const quantity = parseInt(document.getElementById('quantity').value) || 0;
                    price = quantity * service.price;
                }
                priceResult.textContent = price.toFixed(2);

                if (price > 0 && bookingSection.classList.contains('hidden')) {
                    separator.classList.remove('hidden');
                    bookingSection.classList.remove('hidden');
                    bookingSection.style.maxHeight = bookingSectionHeight + 'px';
                }
            };
        });
    }

    function setupBookingForm() {
        const form = document.getElementById('booking-form-actual');
        if (!form) return;
        
        const phoneInput = form.querySelector('input[name="phone"]');
        phoneInput.addEventListener('input', (e) => {
            const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            let value = e.target.value;
            for (let i = 0; i < 10; i++) {
                value = value.replace(new RegExp(arabicNumerals[i], 'g'), i);
            }
            e.target.value = value;
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const bookingDiv = document.querySelector('.booking-form');
            bookingDiv.innerHTML = '<h4>شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.</h4>';
        });
    }
});