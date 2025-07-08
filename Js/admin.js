document.addEventListener('DOMContentLoaded', async() => {
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user || !user.token) {
                window.location.href = '/client/login.html';
                return;
            }

            const productForm = document.getElementById('productForm');
            const msgElement = document.getElementById('formMessage');

            productForm.addEventListener('submit', async(e) => {
                e.preventDefault();

                const formData = {
                    name: document.getElementById('name').value,
                    description: document.getElementById('description').value,
                    price: parseFloat(document.getElementById('price').value),
                    image: document.getElementById('image').value || 'https://via.placeholder.com/150',
                };

                try {
                    const res = await fetch('http://localhost:5000/api/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.token}`,
                        },
                        body: JSON.stringify(formData),
                    });

                    const result = await res.json();
                    if (res.ok) {
                        msgElement.textContent = 'Product added successfully!';
                        msgElement.className = 'success';
                        productForm.reset();
                    } else {
                        msgElement.textContent = result.error || 'Failed to add product';
                        msgElement.className = 'error';
                    }
                } catch (err) {
                    console.error('Fetch error:', err);
                    msgElement.textContent = 'Network error. Please try again.';
                    msgElement.className = 'error';
                }
            });

            await loadOrders();

            async function loadOrders() {
                try {
                    const response = await fetch('http://localhost:5000/api/orders', {
                        headers: {
                            'Authorization': `Bearer ${user.token}`,
                        },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP ${response.status}: ${errorText}`);
                    }

                    const orders = await response.json();
                    const ordersList = document.getElementById('ordersList');

                    if (!orders.length) {
                        ordersList.innerHTML = '<p>No orders found</p>';
                        return;
                    }

                    ordersList.innerHTML = orders.map(order => `
                <div class="order-card">
                    <h3>Order #${order._id}</h3>
                    <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
                    <p>Total: ₹${order.total}</p>
                    <div class="products">
                        ${order.products.map(p => `
                            <p>${(p.productId && p.productId.name) || 'Product'} x${p.quantity} @ ₹${(p.productId && p.productId.price) || '0'}</p>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading orders:', error.message);
            document.getElementById('ordersList').innerHTML = `<p>Error loading orders: ${error.message}</p>`;
        }
    }
});