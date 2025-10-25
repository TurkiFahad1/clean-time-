document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const headerLogo = document.querySelector('header .logo');
    const carouselInner = document.querySelector('.inner'); // لعناصر الكاروسيل

    // إظهار شاشة البداية ثم إخفائها
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }, { once: true });
    }, 1500); // إظهار الشعار لمدة 1.5 ثانية

    // تغيير حجم الشعار عند التمرير
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // بعد التمرير 50 بكسل
            headerLogo.classList.remove('logo-large-initial');
        } else {
            headerLogo.classList.add('logo-large-initial');
        }
    });

    // بيانات الخدمات
    const servicesData = [
        {
            icon: 'https://i.ibb.co/C0W2h2y/carpet.png',
            title: 'الموكيت',
            description: 'تنظيف عميق للموكيت والسجاد بأحدث الأجهزة والمواد الآمنة.',
            priceFormula: (width, length) => (width * length * 7).toFixed(2), // 7 ريال للمتر المربع
            unit: 'متر مربع'
        },
        {
            icon: 'https://i.ibb.co/d7z18S5/couch.png',
            title: 'الكنب',
            description: 'إزالة تامة للبقع والروائح الكريهة ليعود الكنب كأنه جديد.',
            priceFormula: (count) => (count * 60).toFixed(2), // 60 ريال للقطعة
            unit: 'قطعة'
        },
        {
            icon: 'https://i.ibb.co/sK0804h/arabic-sitting.png',
            title: 'الجلسة العربي',
            description: 'نظافة وتعقيم للجلسات العربية مع الحفاظ على ألوانها الزاهية.',
            priceFormula: (count) => (count * 50).toFixed(2), // 50 ريال للمتر
            unit: 'متر'
        },
        {
            icon: 'https://i.ibb.co/XjS3pB4/air-conditioner.png',
            title: 'مكيف شباك',
            description: 'تنظيف شامل للوحدة الداخلية والخارجية لتحسين الأداء.',
            priceFormula: (count) => (count * 80).toFixed(2), // 80 ريال للمكيف
            unit: 'مكيف'
        },
        {
            icon: 'https://i.ibb.co/pLg031Y/curtains.png',
            title: 'ستائر',
            description: 'تنظيف الستائر بالبخار وهي في مكانها بدون فك وتركيب.',
            priceFormula: (count) => (count * 40).toFixed(2), // 40 ريال للمتر
            unit: 'متر'
        },
        {
            icon: 'https://i.ibb.co/m004d41/split-ac.png',
            title: 'مكيف اسبليت',
            description: 'غسيل وصيانة فلاتر ووحدات مكيفات السبليت لضمان هواء نقي.',
            priceFormula: (count) => (count * 120).toFixed(2), // 120 ريال للمكيف
            unit: 'مكيف'
        }
    ];

    const servicesGrid = document.querySelector('.services-grid');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    // إنشاء بطاقات الخدمات
    servicesData.forEach((service, index) => {
        const serviceCard = document.createElement('div');
        serviceCard.classList.add('service-card');
        serviceCard.innerHTML = `
            <div class="service-card-content">
                <img src="${service.icon}" alt="${service.title}">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <button class="animated-btn" data-service-index="${index}">
                    <div class="circle">
                        <span class="icon arrow"></span>
                    </div>
                    <p class="button-text">احسب السعر</p>
                </button>
            </div>
        `;
        servicesGrid.appendChild(serviceCard);
    });

    // فتح الـ Modal
    servicesGrid.addEventListener('click', (event) => {
        const button = event.target.closest('.animated-btn');
        if (button) {
            const serviceIndex = button.dataset.service-index;
            const service = servicesData[serviceIndex];
            openModal(service);
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    function openModal(service) {
        modalBody.innerHTML = `
            <div class="calculator-form">
                <h3>حاسبة سعر ${service.title}</h3>
                <div class="input-group">
                    <label for="input1" class="input-label">${service.unit.includes('متر') ? 'العرض (متر)' : 'العدد'}</label>
                    <input type="number" id="input1" class="input-field" value="1" min="1">
                </div>
                ${service.unit.includes('متر') ? `
                    <div class="input-group">
                        <label for="input2" class="input-label">الطول (متر)</label>
                        <input type="number" id="input2" class="input-field" value="1" min="1">
                    </div>
                ` : ''}
                <div class="price-display">
                    <h4>السعر التقريبي: <span id="calculated-price">0.00</span> ريال</h4>
                    <p>هذا السعر تقريبي وقد يختلف بعد المعاينة</p>
                </div>
                <button id="show-booking-form-btn" class="cta-button">ممتاز! هل تريد حجز موعدك الآن؟</button>
            </div>
            <hr id="booking-separator" class="hidden">
            <div class="booking-form hidden">
                <h4>تأكيد حجز خدمة ${service.title}</h4>
                <div class="input-group">
                    <label for="full-name" class="input-label">الاسم الكامل</label>
                    <input type="text" id="full-name" class="input-field" placeholder="اسمك الكامل" required>
                </div>
                <div class="input-group">
                    <label for="phone-number" class="input-label">رقم الجوال</label>
                    <input type="tel" id="phone-number" class="input-field" placeholder="05XXXXXXXX" required>
                </div>
                <div class="input-group">
                    <label for="booking-date" class="input-label">التاريخ (اختياري)</label>
                    <input type="date" id="booking-date" class="input-field">
                </div>
                <div class="input-group">
                    <label for="notes" class="input-label">ملاحظات إضافية (اختياري)</label>
                    <textarea id="notes" class="input-field" rows="3" placeholder="أضف أي تفاصيل أخرى"></textarea>
                </div>
                <button id="confirm-booking-btn" class="cta-button">تأكيد الحجز الآن</button>
            </div>
        `;

        modal.style.display = 'flex';

        const input1 = document.getElementById('input1');
        const input2 = document.getElementById('input2');
        const calculatedPriceSpan = document.getElementById('calculated-price');
        const showBookingFormBtn = document.getElementById('show-booking-form-btn');
        const bookingForm = document.querySelector('.booking-form');
        const bookingSeparator = document.getElementById('booking-separator');
        const confirmBookingBtn = document.getElementById('confirm-booking-btn');
        const fullNameInput = document.getElementById('full-name');
        const phoneNumberInput = document.getElementById('phone-number');
        const bookingDateInput = document.getElementById('booking-date');
        const notesInput = document.getElementById('notes');

        function calculatePrice() {
            const val1 = parseFloat(input1.value) || 0;
            const val2 = parseFloat(input2 ? input2.value : 1) || 0;
            let price;

            if (service.unit.includes('متر')) {
                price = service.priceFormula(val1, val2);
            } else {
                price = service.priceFormula(val1);
            }
            calculatedPriceSpan.textContent = price;
        }

        input1.addEventListener('input', calculatePrice);
        if (input2) {
            input2.addEventListener('input', calculatePrice);
        }
        calculatePrice(); // حساب السعر الأولي

        showBookingFormBtn.addEventListener('click', () => {
            bookingForm.classList.remove('hidden');
            bookingSeparator.classList.remove('hidden');
            showBookingFormBtn.style.display = 'none'; // إخفاء زر "ممتاز!"
        });

        confirmBookingBtn.addEventListener('click', () => {
            if (!fullNameInput.value || !phoneNumberInput.value) {
                alert('الرجاء تعبئة الاسم ورقم الجوال على الأقل.');
                return;
            }

            const message = `
                طلب حجز خدمة: ${service.title}
                الكمية: ${input1.value} ${service.unit}${input2 ? ` × ${input2.value} متر` : ''}
                السعر التقريبي: ${calculatedPriceSpan.textContent} ريال
                الاسم: ${fullNameInput.value}
                الجوال: ${phoneNumberInput.value}
                التاريخ: ${bookingDateInput.value || 'غير محدد'}
                ملاحظات: ${notesInput.value || 'لا توجد'}
            `;
            const whatsappUrl = `https://wa.me/966500362696?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            modal.style.display = 'none'; // إغلاق المودال بعد الإرسال
        });
    }

    // ======================================================
    // كود تفعيل التحريك اليدوي لقسم الـ Hero (مع الاحتفاظ بالدوران التلقائي)
    // ======================================================
    let isDragging = false;
    let startX;
    let currentRotateY = 0;
    let animationTimeout; // لتتبع مؤقت إعادة تشغيل الرسوم المتحركة

    // دالة لتطبيق التحويل
    function applyRotation() {
        carouselInner.style.transform = `perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(${currentRotateY}deg)`;
    }

    // إيقاف الرسوم المتحركة
    function stopRotationAnimation() {
        carouselInner.style.animationPlayState = 'paused';
        clearTimeout(animationTimeout);
    }

    // إعادة تشغيل الرسوم المتحركة بعد تأخير
    function resumeRotationAnimation() {
        clearTimeout(animationTimeout);
        animationTimeout = setTimeout(() => {
            carouselInner.style.animationPlayState = 'running';
        }, 1000); // يستأنف بعد ثانية من عدم السحب
    }

    carouselInner.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        stopRotationAnimation();
        carouselInner.style.cursor = 'grabbing';
    });

    carouselInner.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // منع تحديد النص
        const dx = e.clientX - startX;
        currentRotateY += dx * 0.5; // ضبط سرعة الدوران
        applyRotation();
        startX = e.clientX; // تحديث نقطة البداية للسحب المستمر
    });

    carouselInner.addEventListener('mouseup', () => {
        isDragging = false;
        carouselInner.style.cursor = 'grab';
        resumeRotationAnimation();
    });

    carouselInner.addEventListener('mouseleave', () => {
        if (isDragging) { // إذا تم ترك العنصر أثناء السحب
            isDragging = false;
            carouselInner.style.cursor = 'grab';
            resumeRotationAnimation();
        }
    });

    // أحداث اللمس للأجهزة المحمولة
    carouselInner.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        stopRotationAnimation();
    }, { passive: true }); // استخدام passive: true لتحسين الأداء على اللمس

    carouselInner.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - startX;
        currentRotateY += dx * 0.5;
        applyRotation();
        startX = e.touches[0].clientX;
    });

    carouselInner.addEventListener('touchend', () => {
        isDragging = false;
        resumeRotationAnimation();
    });
});
