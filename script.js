document.addEventListener('DOMContentLoaded', () => {
    // 1. Data Definitions
    const regions = [
        "Abşeron", "Ağdam", "Ağdaş", "Ağcabədi", "Ağstafa", "Ağsu", "Astara", "Babək",
        "Bakı", "Balakən", "Bərdə", "Beyləqan", "Biləsuvar", "Daşkəsən", "Füzuli",
        "Gədəbəy", "Gəncə", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "İmişli",
        "İsmayıllı", "Cəbrayıl", "Cəlilabad", "Culfa", "Kəlbəcər", "Xaçmaz", "Xankəndi",
        "Xocalı", "Xocavənd", "Xızı", "Kürdəmir", "Laçın", "Lənkəran", "Lerik",
        "Masallı", "Mingəçevir", "Naftalan", "Naxçıvan", "Neftçala", "Oğuz", "Ordubad",
        "Qəbələ", "Qax", "Qazax", "Quba", "Qubadlı", "Qusar", "Saatlı", "Sabirabad",
        "Sədərək", "Salyan", "Samux", "Şabran", "Şahbuz", "Şəki", "Şamaxı", "Şəmkir",
        "Şərur", "Şirvan", "Şuşa", "Siyəzən", "Sumqayıt", "Tərtər", "Tovuz", "Ucar",
        "Yardımlı", "Yevlax", "Zəngilan", "Zaqatala", "Zərdab"
    ];

    const categoryFields = {
        menzil: { label: "Otaq sayı", type: "rooms" },
        heyet_evi: { label: "Otaq sayı", type: "rooms" },
        qaraj: { label: "Sahə (kv.m)", type: "area" },
        obyekt: { label: "Sahə (kv.m) / Otaq", type: "area" },
        torpaq: { label: "Torpaq sahəsi (sot)", type: "area" },
        ofis: { label: "Otaq sayı", type: "rooms" }
    };

    // 2. Populate Location Select
    const locationSelect = document.getElementById('locationSelect');
    // Clear initial items, keep first
    locationSelect.innerHTML = '<option value="">Bütün Azərbaycan</option>';

    // Sort and append
    regions.sort((a, b) => a.localeCompare(b, 'az')).forEach(region => {
        const option = document.createElement('option');
        option.value = region.toLowerCase();
        option.textContent = region;
        locationSelect.appendChild(option);
    });

    // 3. Custom Category Dropdown Logic
    const categorySelectBox = document.getElementById('categorySelectBox');
    const categoryList = document.getElementById('categoryList');
    const selectedCategoryText = document.getElementById('selectedCategoryText');
    const categoryItems = categoryList.querySelectorAll('li');

    // Dynamic field swap elements
    const dynamicFieldLabel = document.getElementById('dynamicFieldLabel');
    const dynamicSelect = document.getElementById('dynamicSelect');

    categorySelectBox.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryList.classList.toggle('show');
        categorySelectBox.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        categoryList.classList.remove('show');
        categorySelectBox.classList.remove('open');
    });

    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();

            // Update Active State
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update Text
            selectedCategoryText.textContent = item.textContent;

            // Close dropdown
            categoryList.classList.remove('show');
            categorySelectBox.classList.remove('open');

            // Handle Dynamic Field swap based on category
            const catValue = item.getAttribute('data-value');
            updateDynamicField(catValue);
        });
    });

    function updateDynamicField(categoryValue) {
        const config = categoryFields[categoryValue];
        if (!config) return;

        // Reset the dynamic field container
        const container = document.getElementById('dynamicFieldContainer');

        let fieldHtml = '';
        if (config.type === 'rooms') {
            fieldHtml += '<label id="dynamicFieldLabel">' + config.label + '</label>';
            fieldHtml += '<select class="native-select" id="dynamicSelect">';
            fieldHtml += '<option value="">İstənilən</option>';
            fieldHtml += '<option value="1">1 otaqlı</option>';
            fieldHtml += '<option value="2">2 otaqlı</option>';
            fieldHtml += '<option value="3">3 otaqlı</option>';
            fieldHtml += '<option value="4">4 otaqlı</option>';
            fieldHtml += '<option value="5+">5 və daha çox</option>';
            fieldHtml += '</select>';
            container.innerHTML = fieldHtml;
        } else if (config.type === 'area') {
            const placeholder = categoryValue === 'torpaq' ? 'Məsələn: 10 sot' : 'Məsələn: 50 kv.m';
            fieldHtml += '<label id="dynamicFieldLabel">' + config.label + '</label>';
            fieldHtml += '<input type="number" class="native-select" id="dynamicSelect" placeholder="' + placeholder + '">';
            container.innerHTML = fieldHtml;
        }

        // Re-attach elements in case they were replaced by outerHTML
        // Actually, best to just morph it properly. Since we overwrite outerHTML, 
        // we should re-query dynamicSelect if needed for further event listeners.
        // For simplicity, this works fine for this UI flow.
    }

    // Initialize with default (menzil)
    updateDynamicField('menzil');

    // 4. Handle Search Build (Placeholder implementation)
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', () => {
        // Collect data
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const activeCategory = categoryList.querySelector('.active').getAttribute('data-value');
        const location = locationSelect.value;
        const dynamicVal = document.getElementById('dynamicSelect').value;
        const priceMin = document.getElementById('priceMin').value;
        const priceMax = document.getElementById('priceMax').value;

        console.log("Search parameters:", {
            transactionType,
            category: activeCategory,
            location,
            dynamicField: dynamicVal,
            price: { min: priceMin, max: priceMax }
        });

        // Add a small visual feedback
        searchButton.textContent = "Axtarılır...";
        searchButton.style.opacity = 0.8;
        setTimeout(() => {
            searchButton.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> Axtar`;
            searchButton.style.opacity = 1;
        }, 800);
    });
});
