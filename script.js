document.addEventListener('DOMContentLoaded', () => {

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const headerLogo = document.querySelector('header .logo'); // تحديد شعار الهيدر
    const carouselInner = document.querySelector('.inner'); // لعناصر الكاروسيل

    // إظهار شاشة البداية ثم إخفائها
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.addEventListener('transitionend', () => { // الانتظار حتى انتهاء التلاشي
             splashScreen.style.display = 'none';
             mainContent.classList.remove('hidden');
             // تأخير بسيط جداً (50ms) قبل تصغير الشعار
             if (headerLogo) {
                 setTimeout(() => {
                     headerLogo.classList.remove('logo-large-initial');
                 }, 50);
             }
        }, { once: true }); // لضمان تنفيذ الحدث مرة واحدة فقط
    }, 2500); // مدة عرض شاشة البداية


    // بيانات الخدمات (من الكود الذي أرسلته)
    const services = [
        { name: 'الموكيت', price: 7, unit: 'm2', description: 'تنظيف عميق للموكيت والسجاد بأحدث الأجهزة والمواد الآمنة.', icon: 'https://img.icons8.com/ios/80/ffffff/rug.png' },
        { name: 'الكنب', price: 20, unit: 'm', description: 'إزالة تامة للبقع والروائح الكريهة ليعود الكنب كأنه جديد.', icon: 'https://img.icons8.com/ios/80/ffffff/sofa.png' },
        { name: 'الجلسة العربي', price: 10, unit: 'm', description: 'نظافة وتعقيم للجلسات العربية مع الحفاظ على ألوانها الزاهية.', icon: 'https://img.icons8.com/ios/80/ffffff/cushion.png' },
        { name: 'مكيف شباك', price: 35, unit: 'qty', description: 'تنظيف شامل للوحدة الداخلية والخارجية لتحسين الأداء.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner.png' },
        { name: 'مكيف اسبليت', price: 50, unit: 'qty', description: 'غسيل وصيانة فلاتر ووحدات مكيفات الاسبليت لضمان هواء نقي.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner--v1.png' },
        { name: 'ستائر', price: 12.5, unit: 'm2', description: 'تنظيف الستائر بالبخار وهي في مكانها بدون فك وتركيب.', icon: 'https://img.icons8.com/ios/80/ffffff/curtain.png' },
    ];

    const servicesGrid = document.querySelector('.services-grid');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // إنشاء بطاقات الخدمات
    if (servicesGrid) {
        services.forEach((service, index) => { // أضفت index هنا
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

    // فتح الـ Modal
    if (servicesGrid) {
        servicesGrid.addEventListener('click', (e) => {
            const button = e.target.closest('.animated-btn');
            if (button) {
                 // استعادة بيانات الخدمة من data-service
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

     // --- باقي كود openModal, setupCalculator, setupBookingForm كما هو في الكود الذي أرسلته ---
     function openModal(service) {
        let formInputs = '';
        if (service.unit === 'm2') {
            formInputs = `<div class="input-group"><label class="input-label" for="width">العرض (متر)</label><input class="input-field" type="number" id="width" placeholder="مثال: 4" value="1" min="1"></div><div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 5" value="1" min="1"></div>`;
        } else if (service.unit === 'm') {
             formInputs = `<div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 7" value="1" min="1"></div>`;
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
        // حساب الارتفاع بعد التأكد من وجود القسم
        let bookingSectionHeight = 0;
        if(bookingSection) {
            bookingSectionHeight = bookingSection.scrollHeight + 100;
        }


        function calculatePrice() { // دالة منفصلة للحساب
            let price = 0;
             if (service.unit === 'm2') {
                const widthInput = document.getElementById('width');
                const lengthInput = document.getElementById('length');
                const width = widthInput ? (parseFloat(widthInput.value) || 0) : 0;
                const length = lengthInput ? (parseFloat(lengthInput.value) || 0) : 0;
                price = width * length * service.price;
            } else if (service.unit === 'm') {
                const lengthInput = document.getElementById('length');
                const length = lengthInput ? (parseFloat(lengthInput.value) || 0) : 0;
                price = length * service.price;
            } else if (service.unit === 'qty') {
                const quantityInput = document.getElementById('quantity');
                const quantity = quantityInput ? (parseInt(quantityInput.value) || 0) : 0;
                price = quantity * service.price;
            }
            if(priceResult) priceResult.textContent = price.toFixed(2); // تأكد من وجود العنصر

            // إظهار قسم الحجز إذا كان السعر أكبر من صفر
            if (price > 0 && bookingSection && separator && bookingSection.classList.contains('hidden')) {
                separator.classList.remove('hidden');
                bookingSection.classList.remove('hidden');
                bookingSection.style.maxHeight = bookingSectionHeight + 'px';
            } else if (price <= 0 && bookingSection && separator && !bookingSection.classList.contains('hidden')) {
                // إخفاء قسم الحجز إذا عاد السعر للصفر
                 bookingSection.style.maxHeight = '0px';
                 setTimeout(() => { // الانتظار لانتهاء حركة الإخفاء
                     if (price <= 0) { // تحقق مرة أخرى قبل الإخفاء التام
                        bookingSection.classList.add('hidden');
                        separator.classList.add('hidden');
                     }
                 }, 700); // يجب أن تطابق مدة الانتقال في CSS
            }
        }

        inputs.forEach(input => {
            input.oninput = calculatePrice; // ربط الدالة بحدث الإدخال
        });

        calculatePrice(); // حساب السعر الأولي عند فتح النافذة
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
            // منع إدخال غير الأرقام
             e.target.value = value.replace(/[^0-9]/g, '');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const bookingDiv = document.querySelector('.booking-form');
            bookingDiv.innerHTML = '<h4>شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.</h4>';
            // هنا يمكنك إضافة كود إرسال البيانات للخادم أو خدمة أخرى
        });
    }

    // ======================================================
    // كود تفعيل التحريك اليدوي لقسم الـ Hero (من الكود الذي أرسلته)
    // ======================================================
    if (carouselInner) { // التأكد من وجود العنصر قبل إضافة الأحداث
        let isDragging = false;
        let startX;
        let currentRotateY = 0; // تتبع الزاوية الحالية
        let startRotateY = 0; // الزاوية عند بدء السحب

        // دالة لتطبيق التحويل
        function applyRotation() {
             // تطبيق الزاوية المحسوبة
            carouselInner.style.transform = `perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(${currentRotateY}deg)`;
            carouselInner.style.transition = 'none'; // إلغاء أي انتقال أثناء السحب
        }

        carouselInner.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            // حفظ الزاوية الحالية عند بدء السحب
             const computedStyle = window.getComputedStyle(carouselInner);
             const matrix = new DOMMatrixReadOnly(computedStyle.transform);
             // حساب زاوية Y الحالية من مصفوفة التحويل (قد يكون معقدًا ويعتمد على المتصفح)
             // طريقة أبسط: استخدام متغير currentRotateY الذي نتتبعه
             startRotateY = currentRotateY;
            carouselInner.style.cursor = 'grabbing';
            carouselInner.style.animation = 'none'; // إيقاف الأنيميشن تمامًا عند السحب
        });

        carouselInner.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            // حساب الزاوية الجديدة بناءً على الزاوية عند البدء + مقدار السحب
            currentRotateY = startRotateY + dx * 0.5; // ضبط سرعة الدوران
            applyRotation();
        });

        const endDrag = () => {
             if (!isDragging) return; // منع التنفيذ المتعدد
             isDragging = false;
             carouselInner.style.cursor = 'grab';
             // يمكن إضافة تأثير استمرار الحركة هنا (momentum) إذا أردت
             // إعادة تشغيل الأنيميشن غير ممكن بنفس الطريقة السابقة لأنه تم إيقافه
             // يمكنك إما تركها ثابتة أو محاولة حساب سرعة نهائية وتطبيق انيميشن قصير
             carouselInner.style.transition = 'transform 0.5s ease-out'; // إضافة انتقال سلس عند ترك السحب (اختياري)
        }

        carouselInner.addEventListener('mouseup', endDrag);
        carouselInner.addEventListener('mouseleave', endDrag);


        // أحداث اللمس للأجهزة المحمولة
        carouselInner.addEventListener('touchstart', (e) => {
             isDragging = true;
             startX = e.touches[0].clientX;
             startRotateY = currentRotateY; // حفظ الزاوية الحالية
             carouselInner.style.animation = 'none'; // إيقاف الأنيميشن
        }, { passive: true });

        carouselInner.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const dx = e.touches[0].clientX - startX;
            currentRotateY = startRotateY + dx * 0.5;
            applyRotation();
        }, { passive: true }); // passive: true مهم لمنع تداخل تمرير الصفحة

        carouselInner.addEventListener('touchend', () => {
             if (!isDragging) return;
             isDragging = false;
             // إعادة تشغيل الأنيميشن أو تركها
             carouselInner.style.transition = 'transform 0.5s ease-out';
        });
    }
});
