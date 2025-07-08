document.getElementById('checkoutBtn').addEventListener('click', async() => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Prepare products data with all required fields
        const products = cart.map(item => ({
            productId: item._id || item.id, // Ensure productId exists
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }));

        // Calculate total
        const total = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                products,
                total
            })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            window.location.href = 'orders.html';
        } else {
            alert(data.error || 'Failed to place order');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to place order. Please try again.');
    }
});