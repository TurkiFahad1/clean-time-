document.addEventListener('DOMContentLoaded', () => {

    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const headerLogo = document.querySelector('header .logo');
    const carouselInner = document.querySelector('.inner');

    // =================================================================
    // === كود شاشة البداية (يعمل مرة واحدة) ===
    // =================================================================
    if (splashScreen && mainContent) {
        if (!sessionStorage.getItem('splashShown')) {
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                splashScreen.addEventListener('transitionend', () => {
                    splashScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                }, { once: true });
                sessionStorage.setItem('splashShown', 'true');
            }, 2500); 
        } else {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('hidden');
        }
    }
    
    // كود تصغير الشعار
    if (headerLogo) {
        headerLogo.classList.remove('logo-large-initial');
        window.onscroll = () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                headerLogo.style.height = '75px';
            } else {
                headerLogo.style.height = '110px';
            }
        };
    }


    // =================================================================
    // === 1. قائمة الخدمات ===
    // =================================================================
    const services = [
        // --- خدمات الآلة الحاسبة ---
        { 
            name: 'مكيف اسبليت', price: 50, unit: 'qty', 
            description: 'غسيل وصيانة الفلاتر.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/air-conditioner--v1.png',
            type: 'calculator',
            featured: true 
        },
        { 
            name: 'مكيف شباك', price: 35, unit: 'qty', 
            description: 'تنظيف شامل للوحدة.', 
            icon: 'shb.png',
            type: 'calculator',
            featured: true 
        },
        { 
            name: 'مكيف دولابي', price: 90, unit: 'qty', 
            description: 'تنظيف شامل للمكيف الواقف.', 
            icon: 'mkef.png',
            type: 'calculator',
            featured: true 
        },
        { 
            name: 'الكنب', price: 20, unit: 'm', 
            description: 'إزالة تامة للبقع والروائح.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/sofa.png',
            type: 'calculator'
        },
        { 
            name: 'الموكيت', price: 7, unit: 'm2', 
            description: 'تنظيف عميق للموكيت والسجاد.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/rug.png',
            type: 'calculator'
        },
        { 
            name: 'الجلسة العربي', price: 10, unit: 'm', 
            description: 'نظافة وتعقيم للجلسات.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/cushion.png',
            type: 'calculator'
        },
        { 
            name: 'ستائر', price: 12.5, unit: 'm2',
            description: 'تنظيف بالبخار في مكانها.', 
            icon: 'star.png',
            type: 'calculator'
        },
        { 
            name: 'الخداديات', price: 7.5, unit: 'm',
            description: 'تنظيف وتعقيم الخداديات.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/pillow.png',
            type: 'calculator'
        },
        { 
            name: 'الأرضيات', price: 4, unit: 'm2', 
            description: 'تلميع وجلي الأرضيات.', 
            icon: 'ard.png',
            type: 'calculator'
        },
        { 
            name: 'النوافذ', price: 12.5, unit: 'qty',
            description: 'تنظيف وتلميع النوافذ.', 
            icon: 'nafth.png',
            type: 'calculator'
        },
        { 
            name: 'مسابح', price: 350, unit: 'qty',
            description: 'تنظيف وتعقيم المسابح.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/swimming-pool.png',
            type: 'calculator'
        },
        
        // --- خدمات الحجز المباشر ---
        { 
            name: 'شقة',
            description: 'تنظيف شامل للشقق السكنية.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/apartment.png',
            type: 'booking' 
        },
        { 
            name: 'فله',
            description: 'تنظيف شامل للفلل والقصور.', 
            icon: 'flah.png',
            type: 'booking' 
        },
        { 
            name: 'خدمات المساجد',
            description: 'نظافة وتعقيم لبيوت الله.', 
            icon: 'https://img.icons8.com/ios/80/ffffff/mosque.png',
            type: 'discount', 
            discount: 50
        }
    ];

    // =================================================================
    // === 2. تعريف المتغيرات والشبكات ===
    // =================================================================
    const featuredServicesGrid = document.getElementById('featured-services-grid');
    const allServicesGrid = document.getElementById('all-services-grid');
    const bookingServicesGrid = document.getElementById('booking-services-grid');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeButton = document.querySelector('.close-button');


    // =================================================================
    // === 3. دالة إنشاء كرت الخدمة (أزرار الريبل) ===
    // =================================================================
    function createServiceCard(service) {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'service-card';
        
        if (service.featured) {
            cardWrapper.classList.add('featured');
        }

        let buttonHtml = '';
        let badgeHtml = '';
        let buttonText = '';
        let buttonClass = 'ripple-btn';

        switch (service.type) {
            case 'booking':
                buttonText = 'احجز موعد';
                break;
            case 'discount':
                badgeHtml = `<div class="discount-badge">خصم ${service.discount}%</div>`;
                buttonText = 'اطلب الخصم';
                buttonClass += ' discount-btn';
                break;
            default: // 'calculator'
                buttonText = 'احسب السعر';
        }
        
        buttonHtml = `<button class="${buttonClass}" data-service='${JSON.stringify(service)}'>${buttonText}</button>`;

        cardWrapper.innerHTML = `
            ${badgeHtml}
            <div class="service-card-content">
                <img src="${service.icon}" alt="${service.name}">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                ${buttonHtml}
            </div>
        `;
        return cardWrapper;
    }

    // =================================================================
    // === 4. توزيع الخدمات على الصفحات ===
    // =================================================================
    if (featuredServicesGrid) {
        // الصفحة الرئيسية: ترتيب مخصص للخدمات
        const featuredServiceNames = [
            "الخداديات",
            "الموكيت",
            "الكنب",
            "الجلسة العربي",
            "مكيف دولابي",
            "مكيف شباك"
        ];

        const servicesToShow = featuredServiceNames.map(name => {
            return services.find(s => s.name === name);
        }).filter(s => s); 

        servicesToShow.forEach(service => {
            featuredServicesGrid.appendChild(createServiceCard(service));
        });
        
        featuredServicesGrid.addEventListener('click', handleGridClick);

    } else if (allServicesGrid && bookingServicesGrid) {
        // صفحة الخدمات
        const calcServices = services.filter(s => s.type === 'calculator');
        const bookingServices = services.filter(s => s.type === 'booking' || s.type === 'discount');

        calcServices.forEach(service => {
            allServicesGrid.appendChild(createServiceCard(service));
        });
        
        bookingServices.forEach(service => {
            bookingServicesGrid.appendChild(createServiceCard(service));
        });

        allServicesGrid.addEventListener('click', handleGridClick);
        bookingServicesGrid.addEventListener('click', handleGridClick);
    }

    // =================================================================
    // === 5. دوال النافذة المنبثقة (Modal) ===
    // =================================================================

    function handleGridClick(e) {
         const button = e.target.closest('.ripple-btn');
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
        let calculatorDisplay = 'block'; 
        let bookingFormDisplay = 'hidden'; 
        let separatorDisplay = 'hidden';
        let modalTitle = '';
        
        switch (service.type) {
            case 'booking':
                modalTitle = `حجز موعد: ${service.name}`;
                calculatorDisplay = 'none'; 
                bookingFormDisplay = ''; 
                separatorDisplay = ''; 
                break;
            case 'discount':
                modalTitle = `طلب خصم ${service.discount}%: ${service.name}`;
                calculatorDisplay = 'none'; 
                bookingFormDisplay = ''; 
                separatorDisplay = ''; 
                break;
            default: // 'calculator'
                modalTitle = `حاسبة سعر ${service.name}`;
                if (service.unit === 'm2') {
                    formInputs = `<div class="input-group"><label class="input-label" for="width">العرض (متر)</label><input class="input-field" type="number" id="width" placeholder="مثال: 4" min="1"></div><div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 5" min="1"></div>`;
                } else if (service.unit === 'm') {
                     formInputs = `<div class="input-group"><label class="input-label" for="length">الطول (متر)</label><input class="input-field" type="number" id="length" placeholder="مثال: 7" min="1"></div>`;
                } else if (service.unit === 'qty') {
                     formInputs = `<div class="input-group"><label class="input-label" for="quantity">العدد</label><input class="input-field" type="number" id="quantity" placeholder="أدخل العدد" min="1"></div>`;
                }
                break;
        }

        modalBody.innerHTML = `
            <div class="calculator-form" style="display: ${calculatorDisplay};">
                <h3>${modalTitle}</h3>
                ${formInputs}
                <div class="price-display">
                    <h4>السعر التقريبي: <span id="price-result">0</span> ريال</h4>
                    <p>هذا السعر تقريبي وقد يختلف بعد المعاينة</p>
                </div>
            </div>
            
            <hr class="${separatorDisplay}">
            
            <div class="booking-form ${bookingFormDisplay}">
                <h4 id="booking-title">ممتاز! هل تريد حجز موعدك الآن؟</h4>
                
                <form id="booking-form-actual">
                    <div class="input-group"><label class="input-label">الاسم الكامل</label><input class="input-field" type="text" name="name" required></div>
                    <div class="input-group"><label class="input-label">رقم الجوال</label><input class="input-field" type="tel" name="phone" required></div>
                    <div class="input-group"><label class="input-label">التاريخ (اختياري)</label><input class="input-field" type="date" name="date"></div>
                    <button type="submit" class="ripple-btn">
                        تأكيد الحجز
                    </button>
                </form>
            </div>`;
            
        modal.style.display = 'flex';
        
        if (service.type !== 'calculator') {
            document.getElementById('booking-title').textContent = modalTitle;
        }

        setupCalculator(service); 
        setupBookingForm(service); 
        
        addRippleEffectToButtons(modalBody);
    }

    // === تم إصلاح دالة setupCalculator لمنع التعليق ===
    function setupCalculator(service) {
        const priceResult = document.getElementById('price-result');
        const inputs = modalBody.querySelectorAll('.input-field[type="number"]');
        const bookingSection = modalBody.querySelector('.booking-form');
        const separator = modalBody.querySelector('hr');
        
        // إذا لم تكن حاسبة (حجز مباشر)، أظهر الفورم فوراً واخرج
        if (service.type !== 'calculator') {
            if (bookingSection && separator) {
                separator.classList.remove('hidden');
                bookingSection.classList.remove('hidden');
                // تعيين ارتفاع تلقائي لضمان الظهور
                bookingSection.style.maxHeight = "1000px"; 
            }
            return; 
        }

        // دالة الحساب
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

            // منطق الإظهار والإخفاء (تم تحسينه)
            if (price > 0) {
                if (bookingSection && separator) {
                    separator.classList.remove('hidden');
                    bookingSection.classList.remove('hidden');
                    // حساب الارتفاع ديناميكياً الآن لضمان الدقة
                    bookingSection.style.maxHeight = bookingSection.scrollHeight + "px";
                }
            } else {
                if (bookingSection && separator) {
                    bookingSection.style.maxHeight = '0px';
                    setTimeout(() => {
                        // تأكد من أن السعر لا يزال صفراً قبل الإخفاء (لتجنب الومضات)
                         if (priceResult.textContent == "0.00") { 
                            bookingSection.classList.add('hidden');
                            separator.classList.add('hidden');
                         }
                     }, 500); 
                }
            }
        }

        inputs.forEach(input => {
            input.oninput = calculatePrice;
        });

        // لا نستدعي calculatePrice() في البداية لأن الحقول فارغة
    }

    function setupBookingForm(service) { 
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
            const submitButton = form.querySelector('button[type="submit"]');

            const serviceName = service.name; 
            const name = form.querySelector('[name="name"]').value;
            const phone = form.querySelector('[name="phone"]').value;
            const date = form.querySelector('[name="date"]').value;

            const formData = {
                "الخدمة": serviceName,
                "الاسم": name,
                "الجوال": phone,
                "التاريخ": date || 'لم يحدد',
                _subject: `حجز جديد: ${serviceName} - ${name}`, 
            };
            
            if (service.type === 'calculator') {
                const price = modalBody.querySelector('#price-result').textContent;
                formData["السعر المقدر"] = price + " ريال";
            }
            
            if (service.type === 'discount') {
                formData["ملاحظة"] = `طلب خصم ${service.discount}% لخدمات المساجد`;
            }
            
            submitButton.textContent = '...جاري الإرسال';
            submitButton.disabled = true;

            // رابط الفورم الخاص بك
            const FORM_ENDPOINT = 'https://formspree.io/f/xvgdvqzg'; 
            
            fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    bookingDiv.innerHTML = '<h4>شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.</h4>';
                } else {
                    bookingDiv.innerHTML = '<h4>عذراً، حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.</h4>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                bookingDiv.innerHTML = '<h4>عذراً، حدث خطأ في الشبكة. الرجاء التأكد من اتصالك بالإنترنت.</h4>';
            })
            .finally(() => {
                setTimeout(() => {
                     if (modal) modal.style.display = 'none';
                }, 4000);
            });
        });
    }
    
    // =================================================================
    // === 6. كود تفعيل تأثير الريبل (الجديد) ===
    // =================================================================
    function createRipple(event) {
        const button = event.currentTarget;

        const oldRipple = button.querySelector(".ripple");
        if (oldRipple) {
            oldRipple.remove();
        }

        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        const rect = button.getBoundingClientRect();
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        
        button.appendChild(circle);
        
        circle.addEventListener('animationend', () => {
            circle.remove();
        });
    }
    
    function addRippleEffectToButtons(container) {
        const buttons = container.querySelectorAll(".ripple-btn");
        buttons.forEach(button => {
            button.addEventListener("click", createRipple);
        });
    }

    addRippleEffectToButtons(document.body);


    // =================================================================
    // === 7. كود الكاروسيل (كما هو) ===
    // =================================================================
    if (carouselInner) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const totalSlides = 6; 
        const slideAngle = 360 / totalSlides; 

        let isDragging = false;
        let startX;
        let currentRotateY = 0;
        let startRotateY = 0;
        let animationFrameId;

        function applyRotation() {
             carouselInner.style.transform = `perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(${currentRotateY}deg)`;
        }
        
        function applySmoothRotation() {
             carouselInner.style.transition = 'transform 0.5s ease-out';
             applyRotation();
        }

        const startDrag = (clientX) => {
             isDragging = true;
             startX = clientX;
             startRotateY = currentRotateY;
             carouselInner.style.cursor = 'grabbing';
             carouselInner.style.transition = 'none'; 
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
             
             const slideIndex = Math.round(currentRotateY / slideAngle);
             currentRotateY = slideIndex * slideAngle;
             
             applySmoothRotation(); 
        };
        
        if (nextBtn) {
            nextBtn.onclick = () => {
                const slideIndex = Math.round(currentRotateY / slideAngle) - 1;
                currentRotateY = slideIndex * slideAngle;
                applySmoothRotation();
            };
        }
        
        if (prevBtn) {
            prevBtn.onclick = () => {
                const slideIndex = Math.round(currentRotateY / slideAngle) + 1;
                currentRotateY = slideIndex * slideAngle;
                applySmoothRotation();
            };
        }

        carouselInner.addEventListener('mousedown', (e) => startDrag(e.clientX));
        document.addEventListener('mousemove', (e) => drag(e.clientX));
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('mouseleave', endDrag);

        carouselInner.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
        carouselInner.addEventListener('touchmove', (e) => {
             if (!isDragging) return;
             drag(e.touches[0].clientX);
        }, { passive: true }); 
        carouselInner.addEventListener('touchend', endDrag);
        carouselInner.addEventListener('touchcancel', endDrag);
    }
});
