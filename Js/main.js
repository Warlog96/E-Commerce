document.addEventListener('DOMContentLoaded', async() => {
    try {
        console.log('Attempting to fetch products...');

        const response = await fetch('http://localhost:5000/api/products', {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const products = await response.json();
        console.log('Received products:', products);

        // Render products...

    } catch (error) {
        console.error('Full error details:', error);
        // Show user-friendly error
    }
});