// License validation against Adelaide Manta server
// This file replaces the old Cloudflare Worker validation

// API endpoint for license validation
const LICENSE_API = 'https://3000-ic3z6in279ach0rcu1qdp-bade0711.us2.manus.computer/api/trpc/stripe.validateLicense';

const LICENSE_STORAGE_KEY_PERSONAL = 'sbp-license';
const LICENSE_STORAGE_KEY_FAMILY = 'sbpf-license';

function getLicenseKey(product) {
    const key = product === 'family' ? LICENSE_STORAGE_KEY_FAMILY : LICENSE_STORAGE_KEY_PERSONAL;
    return localStorage.getItem(key);
}

function saveLicenseKey(product, licenseKey) {
    const key = product === 'family' ? LICENSE_STORAGE_KEY_FAMILY : LICENSE_STORAGE_KEY_PERSONAL;
    localStorage.setItem(key, licenseKey);
}

function removeLicenseKey(product) {
    const key = product === 'family' ? LICENSE_STORAGE_KEY_FAMILY : LICENSE_STORAGE_KEY_PERSONAL;
    localStorage.removeItem(key);
}

async function validateLicense(licenseKey, product) {
    try {
        const res = await fetch(LICENSE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                key: licenseKey, 
                product: product 
            })
        });
        const data = await res.json();
        // tRPC returns { result: { data: { valid: true/false } } }
        return data.result?.data?.valid === true;
    } catch (e) {
        // If the API is unreachable, check if we have a previously validated key
        // This allows offline use after first validation
        const stored = getLicenseKey(product);
        return stored === licenseKey && licenseKey.length > 10;
    }
}

function createLockScreen(product) {
    const productName = product === 'family' ? 'Family' : 'Personal';

    // License translations
    const lt = {
        en: { title: 'Enter Your License Key', desc: 'Paste the license key you received after purchase.', placeholder: 'BM-XXXX-XXXX-XXXX-XXXX', btn: 'Activate', buy: 'Don\'t have a key?', buyLink: 'Purchase now', invalid: 'Invalid license key. Please check and try again.', validating: 'Validating...', logout: 'Deactivate License' },
        it: { title: 'Inserisci la Tua Licenza', desc: 'Incolla la chiave di licenza ricevuta dopo l\'acquisto.', placeholder: 'BM-XXXX-XXXX-XXXX-XXXX', btn: 'Attiva', buy: 'Non hai una chiave?', buyLink: 'Acquista ora', invalid: 'Chiave di licenza non valida. Controlla e riprova.', validating: 'Validazione...', logout: 'Disattiva Licenza' },
        fr: { title: 'Entrez Votre Clé de Licence', desc: 'Collez la clé de licence reçue après l\'achat.', placeholder: 'BM-XXXX-XXXX-XXXX-XXXX', btn: 'Activer', buy: 'Pas de clé ?', buyLink: 'Acheter maintenant', invalid: 'Clé de licence invalide. Vérifiez et réessayez.', validating: 'Validation...', logout: 'Désactiver la Licence' },
        de: { title: 'Lizenzschlüssel Eingeben', desc: 'Fügen Sie den nach dem Kauf erhaltenen Lizenzschlüssel ein.', placeholder: 'BM-XXXX-XXXX-XXXX-XXXX', btn: 'Aktivieren', buy: 'Keinen Schlüssel?', buyLink: 'Jetzt kaufen', invalid: 'Ungültiger Lizenzschlüssel. Bitte prüfen und erneut versuchen.', validating: 'Validierung...', logout: 'Lizenz Deaktivieren' },
        es: { title: 'Ingresa Tu Clave de Licencia', desc: 'Pega la clave de licencia recibida después de la compra.', placeholder: 'BM-XXXX-XXXX-XXXX-XXXX', btn: 'Activar', buy: '¿No tienes clave?', buyLink: 'Comprar ahora', invalid: 'Clave de licencia inválida. Verifica e intenta de nuevo.', validating: 'Validando...', logout: 'Desactivar Licencia' }
    };

    const lang = detectLanguage();
    const t = lt[lang] || lt.en;

    const html = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; z-index: 10000;">
            <div style="background: white; border-radius: 12px; padding: 40px; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center;">
                <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #333;">${t.title}</h1>
                <p style="margin: 0 0 24px 0; color: #666; font-size: 14px;">${t.desc}</p>
                <input type="text" id="license-input" placeholder="${t.placeholder}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; box-sizing: border-box; margin-bottom: 16px; font-family: 'Courier New', monospace;" />
                <button id="license-btn" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 12px;">${t.btn}</button>
                <button id="logout-btn" style="width: 100%; padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">${t.logout}</button>
                <p style="margin: 24px 0 0 0; color: #999; font-size: 12px;">
                    ${t.buy} <a href="https://adelaidemanta.ch" style="color: #667eea; text-decoration: none;">${t.buyLink}</a>
                </p>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.insertBefore(container, document.body.firstChild);

    const input = document.getElementById('license-input');
    const btn = document.getElementById('license-btn');
    const logoutBtn = document.getElementById('logout-btn');

    btn.addEventListener('click', async () => {
        const key = input.value.trim();
        if (!key) return;

        btn.textContent = t.validating;
        btn.disabled = true;

        const isValid = await validateLicense(key, product);
        if (isValid) {
            saveLicenseKey(product, key);
            container.remove();
        } else {
            input.style.borderColor = '#ff6b6b';
            input.placeholder = t.invalid;
            btn.textContent = t.btn;
            btn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', () => {
        removeLicenseKey(product);
        location.reload();
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btn.click();
    });
}

function detectLanguage() {
    const stored = localStorage.getItem('app-language');
    if (stored && ['en', 'it', 'fr', 'de'].includes(stored)) return stored;

    const browserLang = navigator.language.split('-')[0];
    if (['en', 'it', 'fr', 'de'].includes(browserLang)) return browserLang;

    return 'en';
}

// Check license on page load
document.addEventListener('DOMContentLoaded', () => {
    // Detect product type from page context (personal or family)
    const product = window.APP_PRODUCT || 'personal'; // Set window.APP_PRODUCT in HTML

    const stored = getLicenseKey(product);
    if (stored) {
        validateLicense(stored, product).then(isValid => {
            if (!isValid) {
                createLockScreen(product);
            }
        });
    } else {
        createLockScreen(product);
    }
});
