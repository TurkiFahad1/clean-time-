document.addEventListener('DOMContentLoaded', () => {

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const headerLogo = document.querySelector('header .logo');
    const carouselInner = document.querySelector('.inner');

    // شاشة البداية (بدون حركة تصغير الشعار عند التمرير)
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
            // لا حاجة لإزالة logo-large-initial هنا، سيبقى الشعار بالحجم الكبير
        }, { once: true });
    }, 2500);


    // بيانات الخدمات
    const services = [
        { name: 'الموكيت', price: 7, unit: 'm2', description: 'تنظيف عميق للموكيت والسجاد.', icon: 'https://img.icons8.com/ios/80/ffffff/rug.png' },
        { name: 'الكنب', price: 20, unit: 'm', description: 'إزالة تامة للبقع والروائح.', icon: 'https://img.icons8.com/ios/80/ffffff/sofa.png' },
        { name: 'الجلسة العربي', price: 10, unit: 'm', description: 'نظافة وتعقيم للجلسات.', icon: 'https://img.icons8.com/ios/80/ffffff/cushion.png' },
        { name: 'مكيف شباك', price: 35, unit: 'qty', description: 'تنظيف شامل للوحدة.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner.png' },
        { name: 'مكيف اسبليت', price: 50, unit: 'qty', description: 'غسيل وصيانة الفلاتر.', icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner--v1.png' },
        { name: 'ستائر', price: 12.5, unit: 'm2', description: 'تنظيف بالبخار في مكانها.', icon: 'https://img.icons8.com/ios/80/ffffff/curtain.png' },
    ];

    const featuredServicesGrid = document.getElementById('featured-services-grid');
    const allServicesGrid = document.getElementById('all-services-grid');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');

    function createServiceCard(service) {
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
        return cardWrapper;
    }

    if (featuredServicesGrid) {
        services.slice(0, 6).forEach(service => {
            featuredServicesGrid.appendChild(createServiceCard(service));
        });
        featuredServicesGrid.addEventListener('click', handleGridClick);

    } else if (allServicesGrid) {
        services.forEach(service => {
            allServicesGrid.appendChild(createServiceCard(service));
        });
        allServicesGrid.addEventListener('click', handleGridClick);
    }

    function handleGridClick(e) {
         const button = e.target.closest('.animated-btn');
         if (button) {
             const service = JSON.parse(button.dataset.service);
             openModal(service);
         }
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
        let bookingSectionHeight = 0;
        if(bookingSection) {
            const wasHidden = bookingSection.classList.contains('hidden');
            if (wasHidden) bookingSection.classList.remove('hidden');
            bookingSectionHeight = bookingSection.scrollHeight + 100;
             if (wasHidden) bookingSection.classList.add('hidden');
        }

        function calculatePrice() {
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
            if(priceResult) priceResult.textContent = price.toFixed(2);

            if (price > 0 && bookingSection && separator && bookingSection.classList.contains('hidden')) {
                separator.classList.remove('hidden');
                bookingSection.classList.remove('hidden');
                bookingSection.style.maxHeight = bookingSectionHeight + 'px';
            } else if (price <= 0 && bookingSection && separator && !bookingSection.classList.contains('hidden')) {
                 bookingSection.style.maxHeight = '0px';
                 setTimeout(() => {
                     if (price <= 0) {
                        bookingSection.classList.add('hidden');
                        separator.classList.add('hidden');
                     }
                 }, 700);
            }
        }

        inputs.forEach(input => {
            input.oninput = calculatePrice;
        });

        calculatePrice(); // الحساب الأولي
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
             e.target.value = value.replace(/[^0-9]/g, '');
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const bookingDiv = document.querySelector('.booking-form');
            const serviceNameElement = bookingDiv.closest('.modal-content').querySelector('.calculator-form h3');
            const serviceName = serviceNameElement ? serviceNameElement.textContent.replace('حاسبة سعر ','') : 'خدمة غير محددة';
            const name = form.querySelector('[name="name"]').value;
            const phone = form.querySelector('[name="phone"]').value;
            const date = form.querySelector('[name="date"]').value;
            const price = modalBody.querySelector('#price-result').textContent;

            bookingDiv.innerHTML = '<h4>شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.</h4>';
             setTimeout(() => {
                 if (modal) modal.style.display = 'none';
             }, 3000);
        });
    }

    // كود تفعيل التحريك اليدوي لقسم الـ Hero
    if (carouselInner) {
        let isDragging = false;
        let startX;
        let currentRotateY = 0;
        let startRotateY = 0;
        let animationFrameId;

        function applyRotation() {
             carouselInner.style.transform = `perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(${currentRotateY}deg)`;
             carouselInner.style.transition = 'none';
        }

        const startDrag = (clientX) => {
             isDragging = true;
             startX = clientX;
             startRotateY = currentRotateY;
             carouselInner.style.cursor = 'grabbing';
             carouselInner.style.animation = 'none';
             cancelAnimationFrame(animationFrameId);
        };

        const drag = (clientX) => {
            if (!isDragging) return;
            const dx = clientX - startX;
            currentRotateY = startRotateY + dx * 0.4;
             cancelAnimationFrame(animationFrameId);
             animationFrameId = requestAnimationFrame(applyRotation);
        };

        const endDrag = () => {
             if (!isDragging) return;
             isDragging = false;
             carouselInner.style.cursor = 'grab';
             carouselInner.style.transition = 'transform 0.5s ease-out';
        };

        carouselInner.addEventListener('mousedown', (e) => startDrag(e.clientX));
        document.addEventListener('mousemove', (e) => drag(e.clientX));
        document.addEventListener('mouseup', endDrag);
        carouselInner.addEventListener('mouseleave', endDrag);

        carouselInner.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        carouselInner.addEventListener('touchmove', (e) => {
             if (!isDragging) return;
             e.preventDefault();
             drag(e.touches[0].clientX);
        }, { passive: false });
        carouselInner.addEventListener('touchend', endDrag);
        carouselInner.addEventListener('touchcancel', endDrag);
    }
});