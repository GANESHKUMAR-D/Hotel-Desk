let rooms = [
    { id: 101, type: 'Single', status: 'available', price: 99 },
    { id: 102, type: 'Single', status: 'occupied', price: 99 },
    { id: 103, type: 'Double', status: 'maintenance', price: 149 },
    { id: 201, type: 'Double', status: 'available', price: 149 },
    { id: 202, type: 'Suite', status: 'occupied', price: 299 },
    { id: 301, type: 'Suite', status: 'available', price: 299 },
];

let bookings = [
    { id: 'B1001', guestId: 1, roomId: 102, checkIn: '2025-04-05', checkOut: '2025-04-07', status: 'current' },
    { id: 'B1002', guestId: 2, roomId: 202, checkIn: '2025-04-03', checkOut: '2025-04-08', status: 'current' },
    { id: 'B1003', guestId: 3, roomId: 103, checkIn: '2025-04-10', checkOut: '2025-04-15', status: 'upcoming' },
    { id: 'B1004', guestId: 1, roomId: 301, checkIn: '2025-03-25', checkOut: '2025-03-28', status: 'past' },
];

let guests = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '555-1234', stays: 2 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678', stays: 1 },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '555-9012', stays: 1 },
];

// DOM Elements
const navButtons = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.getElementById('modalContent');

// Navigation
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and sections
        navButtons.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active-section'));
        
        // Add active class to clicked button and corresponding section
        button.classList.add('active');
        const targetSection = document.getElementById(button.id.replace('Btn', ''));
        targetSection.classList.add('active-section');
        
        // Load section data
        if (button.id === 'roomsBtn') {
            loadRooms();
        } else if (button.id === 'bookingsBtn') {
            loadBookings();
        } else if (button.id === 'guestsBtn') {
            loadGuests();
        } else if (button.id === 'dashboardBtn') {
            updateDashboard();
        }
    });
});

// Modal functionality
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Dashboard functionality
function updateDashboard() {
    document.getElementById('availableRooms').textContent = rooms.filter(room => room.status === 'available').length;
    document.getElementById('currentBookings').textContent = bookings.filter(booking => booking.status === 'current').length;
    document.getElementById('totalGuests').textContent = guests.length;
    
    // Calculate today's revenue (for demo - just a fixed value)
    document.getElementById('todayRevenue').textContent = '$' + calculateTodayRevenue();
}

function calculateTodayRevenue() {
    // In a real app, this would calculate based on check-ins/check-outs
    // For demo, we'll just use a fixed value
    return 599;
}

// Dashboard button handlers
document.getElementById('newBookingBtn').addEventListener('click', () => {
    showNewBookingForm();
});

document.getElementById('checkInBtn').addEventListener('click', () => {
    showCheckInForm();
});

document.getElementById('checkOutBtn').addEventListener('click', () => {
    showCheckOutForm();
});

// Rooms functionality
function loadRooms() {
    const roomsList = document.getElementById('roomsList');
    roomsList.innerHTML = '';
    
    const filterStatus = document.getElementById('roomFilterStatus').value;
    const searchTerm = document.getElementById('searchRoom').value.toLowerCase();
    
    const filteredRooms = rooms.filter(room => {
        const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
        const matchesSearch = room.id.toString().includes(searchTerm) || 
                             room.type.toLowerCase().includes(searchTerm);
        return matchesStatus && matchesSearch;
    });
    
    filteredRooms.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.id}</td>
            <td>${room.type}</td>
            <td><span class="status status-${room.status}">${room.status}</span></td>
            <td>$${room.price}</td>
            <td>
                <button class="table-action-btn edit-room" data-id="${room.id}">Edit</button>
                <button class="table-action-btn delete-room" data-id="${room.id}">Delete</button>
            </td>
        `;
        roomsList.appendChild(row);
    });
    
    // Add event listeners to the newly created buttons
    document.querySelectorAll('.edit-room').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomId = parseInt(e.target.getAttribute('data-id'));
            showEditRoomForm(roomId);
        });
    });
    
    document.querySelectorAll('.delete-room').forEach(button => {
        button.addEventListener('click', (e) => {
            const roomId = parseInt(e.target.getAttribute('data-id'));
            deleteRoom(roomId);
        });
    });
}

document.getElementById('roomFilterStatus').addEventListener('change', loadRooms);
document.getElementById('searchRoom').addEventListener('input', loadRooms);

document.getElementById('addRoomBtn').addEventListener('click', () => {
    showAddRoomForm();
});

function showAddRoomForm() {
    modalContent.innerHTML = `
        <h3>Add New Room</h3>
        <form id="addRoomForm">
            <div class="form-group">
                <label for="roomNumber">Room Number</label>
                <input type="number" id="roomNumber" required>
            </div>
            <div class="form-group">
                <label for="roomType">Room Type</label>
                <select id="roomType" required>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Suite">Suite</option>
                </select>
            </div>
            <div class="form-group">
                <label for="roomStatus">Status</label>
                <select id="roomStatus" required>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>
            <div class="form-group">
                <label for="roomPrice">Price per Night ($)</label>
                <input type="number" id="roomPrice" required>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Save Room</button>
            </div>
        </form>
    `;
    
    document.querySelector('#addRoomForm .cancel-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('addRoomForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newRoom = {
            id: parseInt(document.getElementById('roomNumber').value),
            type: document.getElementById('roomType').value,
            status: document.getElementById('roomStatus').value,
            price: parseFloat(document.getElementById('roomPrice').value)
        };
        
        // Check if room number already exists
        if (rooms.some(room => room.id === newRoom.id)) {
            alert('Room number already exists!');
            return;
        }
        
        rooms.push(newRoom);
        modal.style.display = 'none';
        loadRooms();
        updateDashboard();
    });
    
    modal.style.display = 'block';
}

function showEditRoomForm(roomId) {
    const room = rooms.find(room => room.id === roomId);
    
    if (!room) return;
    
    modalContent.innerHTML = `
        <h3>Edit Room</h3>
        <form id="editRoomForm">
            <div class="form-group">
                <label for="roomNumber">Room Number</label>
                <input type="number" id="roomNumber" value="${room.id}" readonly>
            </div>
            <div class="form-group">
                <label for="roomType">Room Type</label>
                <select id="roomType" required>
                    <option value="Single" ${room.type === 'Single' ? 'selected' : ''}>Single</option>
                    <option value="Double" ${room.type === 'Double' ? 'selected' : ''}>Double</option>
                    <option value="Suite" ${room.type === 'Suite' ? 'selected' : ''}>Suite</option>
                </select>
            </div>
            <div class="form-group">
                <label for="roomStatus">Status</label>
                <select id="roomStatus" required>
                    <option value="available" ${room.status === 'available' ? 'selected' : ''}>Available</option>
                    <option value="occupied" ${room.status === 'occupied' ? 'selected' : ''}>Occupied</option>
                    <option value="maintenance" ${room.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                </select>
            </div>
            <div class="form-group">
                <label for="roomPrice">Price per Night ($)</label>
                <input type="number" id="roomPrice" value="${room.price}" required>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Update Room</button>
            </div>
        </form>
    `;
    
    document.querySelector('#editRoomForm .cancel-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('editRoomForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedRoom = {
            id: parseInt(document.getElementById('roomNumber').value),
            type: document.getElementById('roomType').value,
            status: document.getElementById('roomStatus').value,
            price: parseFloat(document.getElementById('roomPrice').value)
        };
        
        const index = rooms.findIndex(r => r.id === updatedRoom.id);
        if (index !== -1) {
            rooms[index] = updatedRoom;
        }
        
        modal.style.display = 'none';
        loadRooms();
        updateDashboard();
    });
    
    modal.style.display = 'block';
}

function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        // Check if room is occupied or has current/upcoming bookings
        if (rooms.find(room => room.id === roomId).status === 'occupied') {
            alert('Cannot delete an occupied room!');
            return;
        }
        
        if (bookings.some(booking => booking.roomId === roomId && (booking.status === 'current' || booking.status === 'upcoming'))) {
            alert('Cannot delete a room with current or upcoming bookings!');
            return;
        }
        
        rooms = rooms.filter(room => room.id !== roomId);
        loadRooms();
        updateDashboard();
    }
}

// Bookings functionality
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';
    
    const filterStatus = document.getElementById('bookingFilterStatus').value;
    const searchTerm = document.getElementById('searchBooking').value.toLowerCase();
    
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const guest = guests.find(g => g.id === booking.guestId);
        const matchesSearch = booking.id.toLowerCase().includes(searchTerm) || 
                              (guest && guest.name.toLowerCase().includes(searchTerm));
        return matchesStatus && matchesSearch;
    });
    
    filteredBookings.forEach(booking => {
        const guest = guests.find(g => g.id === booking.guestId);
        const room = rooms.find(r => r.id === booking.roomId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${guest ? guest.name : 'Unknown'}</td>
            <td>${room ? room.id : 'Unknown'} (${room ? room.type : 'N/A'})</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td><span class="status status-${booking.status}">${booking.status}</span></td>
            <td>
                <button class="table-action-btn view-booking" data-id="${booking.id}">View</button>
                <button class="table-action-btn edit-booking" data-id="${booking.id}">Edit</button>
                <button class="table-action-btn delete-booking" data-id="${booking.id}">Cancel</button>
            </td>
        `;
        bookingsList.appendChild(row);
    });
    
    // Add event listeners to the newly created buttons
    document.querySelectorAll('.view-booking').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookingId = e.target.getAttribute('data-id');
            viewBooking(bookingId);
        });
    });
    
    document.querySelectorAll('.edit-booking').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookingId = e.target.getAttribute('data-id');
            editBooking(bookingId);
        });
    });
    
    document.querySelectorAll('.delete-booking').forEach(button => {
        button.addEventListener('click', (e) => {
            const bookingId = e.target.getAttribute('data-id');
            cancelBooking(bookingId);
        });
    });
}

document.getElementById('bookingFilterStatus').addEventListener('change', loadBookings);
document.getElementById('searchBooking').addEventListener('input', loadBookings);

function showNewBookingForm() {
    modalContent.innerHTML = `
        <h3>Create New Booking</h3>
        <form id="newBookingForm">
            <div class="form-group">
                <label for="bookingGuest">Guest</label>
                <select id="bookingGuest" required>
                    <option value="">Select Guest</option>
                    ${guests.map(guest => `<option value="${guest.id}">${guest.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="bookingRoom">Room</label>
                <select id="bookingRoom" required>
                    <option value="">Select Room</option>
                    ${rooms.filter(room => room.status === 'available').map(room => 
                        `<option value="${room.id}">${room.id} - ${room.type} ($${room.price}/night)</option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="checkInDate">Check-in Date</label>
                <input type="date" id="checkInDate" required>
            </div>
            <div class="form-group">
                <label for="checkOutDate">Check-out Date</label>
                <input type="date" id="checkOutDate" required>
            </div>
            <div class="form-buttons">
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="submit" class="save-btn">Create Booking</button>
            </div>
        </form>
    `;
    
    // Set default dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    document.getElementById('checkInDate').value = today.toISOString().split('T')[0];
    document.getElementById('checkOutDate').value = tomorrow.toISOString().split('T')[0];
    
    document.querySelector('#newBookingForm .cancel-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    document.getElementById('newBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const guestId = parseInt(document.getElementById('bookingGuest').value);
        const roomId = parseInt(document.getElementById('bookingRoom').value);
        const checkIn = document.getElementById('checkInDate').value;
        const checkOut = document.getElementById('checkOutDate').value;
        
        // Validate dates
        if (new Date(checkIn) >= new Date(checkOut)) {
            alert('Check-out date must be after check-in date!');
            return;
        }
        
        // Generate booking ID
        const newId = 'B' + (1000 + bookings.length + 1);
        
        const newBooking = {
            id: newId,
            guestId: guestId,
            roomId: roomId,
            checkIn: checkIn,
            checkOut: checkOut,
            status: 'upcoming'
        };
        
        // Update room status
        const roomIndex = rooms.findIndex(room => room.id === roomId);
        if (roomIndex !== -1) {
            rooms[roomIndex].status = 'occupied';
        }
        
        bookings.push(newBooking);
        modal.style.display = 'none';
        
        // If we're on the bookings page, refresh the list
        if (document.getElementById('bookings').classList.contains('active-section')) {
            loadBookings();
        }
        
        updateDashboard();
    });
    
    modal.style.display = 'block';
}

function viewBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    const guest = guests.find(g => g.id === booking.guestId);
    const room = rooms.find(r => r.id === booking.roomId);
    
    modalContent.innerHTML = `
        <h3>Booking Details</h3>
        <div class="booking-details">
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Guest:</strong> ${guest ? guest.name : 'Unknown'}</p>
            <p><strong>Contact:</strong> ${guest ? guest.email : 'N/A'} | ${guest ? guest.phone : 'N/A'}</p>
            <p><strong>Room:</strong> ${room ? room.id : 'Unknown'} (${room ? room.type : 'N/A'})</p>
            <p><strong>Price:</strong> $${room ? room.price : 'N/A'}/night</p>
            <p><strong>Check-in:</strong> ${booking.checkIn}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
        </div>
        <div class="form-buttons">
            <button type="button" class="cancel-btn close-view">Close</button>
        </div>
    `;
    
    document.querySelector('.close-view').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.style.display = 'block';
}

function editBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    modalContent.innerHTML = `
        <h3>Edit Booking</h3>
        <form id="editBookingForm">
            <div class="form-group">
                <label for="bookingId">Booking ID</label>
                <input type="text" id="bookingId" value="${booking.id}" readonly>
            </div>
            <div class="form-group">
                <label for="bookingGuest">Guest</label>
                <select id="bookingGuest" required>
                    ${guests.map(guest => 
                        `<option value="${guest.id}" ${guest.id === booking.guestId ? 'selected' : ''}>
                            ${guest.name}
                        </option>`
                    ).join('')}
                </select>
                </div>
                <div class="form-group">
                    <label for="bookingRoom">Room</label>
                    <select id="bookingRoom" required>
                        ${rooms.map(room => 
                            `<option value="${room.id}" ${room.id === booking.roomId ? 'selected' : ''}>
                                ${room.id} - ${room.type} ($${room.price}/night)
                            </option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="checkInDate">Check-in Date</label>
                    <input type="date" id="checkInDate" value="${booking.checkIn}" required>
                </div>
                <div class="form-group">
                    <label for="checkOutDate">Check-out Date</label>
                    <input type="date" id="checkOutDate" value="${booking.checkOut}" required>
                </div>
                <div class="form-group">
                    <label for="bookingStatus">Status</label>
                    <select id="bookingStatus" required>
                        <option value="upcoming" ${booking.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                        <option value="current" ${booking.status === 'current' ? 'selected' : ''}>Current</option>
                        <option value="past" ${booking.status === 'past' ? 'selected' : ''}>Past</option>
                        <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Update Booking</button>
                </div>
            </form>
        `;
        
        document.querySelector('#editBookingForm .cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('editBookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const updatedBooking = {
                id: document.getElementById('bookingId').value,
                guestId: parseInt(document.getElementById('bookingGuest').value),
                roomId: parseInt(document.getElementById('bookingRoom').value),
                checkIn: document.getElementById('checkInDate').value,
                checkOut: document.getElementById('checkOutDate').value,
                status: document.getElementById('bookingStatus').value
            };
            
            // Validate dates
            if (new Date(updatedBooking.checkIn) >= new Date(updatedBooking.checkOut)) {
                alert('Check-out date must be after check-in date!');
                return;
            }
            
            // Handle room status changes if needed
            if (booking.roomId !== updatedBooking.roomId) {
                // Free up the old room
                const oldRoomIndex = rooms.findIndex(room => room.id === booking.roomId);
                if (oldRoomIndex !== -1) {
                    rooms[oldRoomIndex].status = 'available';
                }
                
                // Occupy the new room
                const newRoomIndex = rooms.findIndex(room => room.id === updatedBooking.roomId);
                if (newRoomIndex !== -1) {
                    rooms[newRoomIndex].status = 'occupied';
                }
            }
            
            // Update the booking
            const bookingIndex = bookings.findIndex(b => b.id === updatedBooking.id);
            if (bookingIndex !== -1) {
                bookings[bookingIndex] = updatedBooking;
            }
            
            modal.style.display = 'none';
            loadBookings();
            updateDashboard();
        });
        
        modal.style.display = 'block';
    }

    function cancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking?')) {
            const booking = bookings.find(b => b.id === bookingId);
            if (!booking) return;
            
            // Only allow cancellation of upcoming bookings
            if (booking.status !== 'upcoming') {
                alert('Only upcoming bookings can be cancelled!');
                return;
            }
            
            // Change booking status
            booking.status = 'cancelled';
            
            // Make room available
            const room = rooms.find(r => r.id === booking.roomId);
            if (room) {
                room.status = 'available';
            }
            
            loadBookings();
            updateDashboard();
        }
    }

    function showCheckInForm() {
        // Get upcoming bookings with check-in date of today or before
        const today = new Date().toISOString().split('T')[0];
        const upcomingBookings = bookings.filter(b => 
            b.status === 'upcoming' && b.checkIn <= today
        );
        
        modalContent.innerHTML = `
            <h3>Check-In Guest</h3>
            ${upcomingBookings.length === 0 ? 
                '<p>No bookings available for check-in.</p>' : 
                `<form id="checkInForm">
                    <div class="form-group">
                        <label for="selectBooking">Select Booking</label>
                        <select id="selectBooking" required>
                            <option value="">Select a booking</option>
                            ${upcomingBookings.map(booking => {
                                const guest = guests.find(g => g.id === booking.guestId);
                                const room = rooms.find(r => r.id === booking.roomId);
                                return `<option value="${booking.id}">
                                    ${guest ? guest.name : 'Unknown'} - Room ${room ? room.id : 'Unknown'} (${booking.checkIn})
                                </option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Check In</button>
                    </div>
                </form>`
            }
        `;
        
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        if (upcomingBookings.length > 0) {
            document.getElementById('checkInForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const bookingId = document.getElementById('selectBooking').value;
                if (!bookingId) {
                    alert('Please select a booking!');
                    return;
                }
                
                const booking = bookings.find(b => b.id === bookingId);
                booking.status = 'current';
                
                // Update room status to occupied if not already
                const room = rooms.find(r => r.id === booking.roomId);
                if (room) {
                    room.status = 'occupied';
                }
                
                modal.style.display = 'none';
                if (document.getElementById('bookings').classList.contains('active-section')) {
                    loadBookings();
                }
                updateDashboard();
            });
        }
        
        modal.style.display = 'block';
    }

    function showCheckOutForm() {
        // Get current bookings
        const currentBookings = bookings.filter(b => b.status === 'current');
        
        modalContent.innerHTML = `
            <h3>Check-Out Guest</h3>
            ${currentBookings.length === 0 ? 
                '<p>No bookings available for check-out.</p>' : 
                `<form id="checkOutForm">
                    <div class="form-group">
                        <label for="selectBooking">Select Booking</label>
                        <select id="selectBooking" required>
                            <option value="">Select a booking</option>
                            ${currentBookings.map(booking => {
                                const guest = guests.find(g => g.id === booking.guestId);
                                const room = rooms.find(r => r.id === booking.roomId);
                                return `<option value="${booking.id}">
                                    ${guest ? guest.name : 'Unknown'} - Room ${room ? room.id : 'Unknown'} (${booking.checkOut})
                                </option>`;
                            }).join('')}
                        </select>
                    </div>
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="save-btn">Check Out</button>
                    </div>
                </form>`
            }
        `;
        
        document.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        if (currentBookings.length > 0) {
            document.getElementById('checkOutForm').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const bookingId = document.getElementById('selectBooking').value;
                if (!bookingId) {
                    alert('Please select a booking!');
                    return;
                }
                
                const booking = bookings.find(b => b.id === bookingId);
                booking.status = 'past';
                
                // Update room status to available
                const room = rooms.find(r => r.id === booking.roomId);
                if (room) {
                    room.status = 'available';
                }
                
                // Update guest's stay count
                const guest = guests.find(g => g.id === booking.guestId);
                if (guest) {
                    guest.stays += 1;
                }
                
                modal.style.display = 'none';
                if (document.getElementById('bookings').classList.contains('active-section')) {
                    loadBookings();
                }
                updateDashboard();
            });
        }
        
        modal.style.display = 'block';
    }

    // Guests functionality
    function loadGuests() {
        const guestsList = document.getElementById('guestsList');
        guestsList.innerHTML = '';
        
        const searchTerm = document.getElementById('searchGuest').value.toLowerCase();
        
        const filteredGuests = guests.filter(guest => 
            guest.name.toLowerCase().includes(searchTerm) ||
            guest.email.toLowerCase().includes(searchTerm) ||
            guest.phone.includes(searchTerm)
        );
        
        filteredGuests.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.id}</td>
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td>${guest.phone}</td>
                <td>${guest.stays}</td>
                <td>
                    <button class="table-action-btn view-guest" data-id="${guest.id}">View</button>
                    <button class="table-action-btn edit-guest" data-id="${guest.id}">Edit</button>
                    <button class="table-action-btn delete-guest" data-id="${guest.id}">Delete</button>
                </td>
            `;
            guestsList.appendChild(row);
        });
        
        // Add event listeners
        document.querySelectorAll('.view-guest').forEach(button => {
            button.addEventListener('click', (e) => {
                const guestId = parseInt(e.target.getAttribute('data-id'));
                viewGuest(guestId);
            });
        });
        
        document.querySelectorAll('.edit-guest').forEach(button => {
            button.addEventListener('click', (e) => {
                const guestId = parseInt(e.target.getAttribute('data-id'));
                editGuest(guestId);
            });
        });
        
        document.querySelectorAll('.delete-guest').forEach(button => {
            button.addEventListener('click', (e) => {
                const guestId = parseInt(e.target.getAttribute('data-id'));
                deleteGuest(guestId);
            });
        });
    }

    document.getElementById('searchGuest').addEventListener('input', loadGuests);

    document.getElementById('addGuestBtn').addEventListener('click', () => {
        showAddGuestForm();
    });

    function showAddGuestForm() {
        modalContent.innerHTML = `
            <h3>Add New Guest</h3>
            <form id="addGuestForm">
                <div class="form-group">
                    <label for="guestName">Full Name</label>
                    <input type="text" id="guestName" required>
                </div>
                <div class="form-group">
                    <label for="guestEmail">Email</label>
                    <input type="email" id="guestEmail" required>
                </div>
                <div class="form-group">
                    <label for="guestPhone">Phone</label>
                    <input type="text" id="guestPhone" required>
                </div>
                <div class="form-buttons">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Save Guest</button>
                </div>
            </form>
        `;
        
        document.querySelector('#addGuestForm .cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('addGuestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newGuest = {
                id: guests.length > 0 ? Math.max(...guests.map(g => g.id)) + 1 : 1,
                name: document.getElementById('guestName').value,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value,
                stays: 0
            };
            
            guests.push(newGuest);
            modal.style.display = 'none';
            loadGuests();
        });
        
        modal.style.display = 'block';
    }

    function viewGuest(guestId) {
        const guest = guests.find(g => g.id === guestId);
        if (!guest) return;
        
        // Get guest's bookings
        const guestBookings = bookings.filter(b => b.guestId === guestId);
        
        modalContent.innerHTML = `
            <h3>Guest Details</h3>
            <div class="guest-details">
                <p><strong>ID:</strong> ${guest.id}</p>
                <p><strong>Name:</strong> ${guest.name}</p>
                <p><strong>Email:</strong> ${guest.email}</p>
                <p><strong>Phone:</strong> ${guest.phone}</p>
                <p><strong>Total Stays:</strong> ${guest.stays}</p>
            </div>
            <h4>Booking History</h4>
            ${guestBookings.length === 0 ? 
                '<p>No booking history found.</p>' : 
                `<table class="modal-table">
                    <thead>
                        <tr>
                            <th>Booking ID</th>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${guestBookings.map(booking => {
                            const room = rooms.find(r => r.id === booking.roomId);
                            return `<tr>
                                <td>${booking.id}</td>
                                <td>${room ? room.id : 'Unknown'}</td>
                                <td>${booking.checkIn}</td>
                                <td>${booking.checkOut}</td>
                                <td>${booking.status}</td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>`
            }
            <div class="form-buttons">
                <button type="button" class="cancel-btn close-view">Close</button>
            </div>
        `;
        
        document.querySelector('.close-view').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.style.display = 'block';
    }

    function editGuest(guestId) {
        const guest = guests.find(g => g.id === guestId);
        if (!guest) return;
        
        modalContent.innerHTML = `
            <h3>Edit Guest</h3>
            <form id="editGuestForm">
                <div class="form-group">
                    <label for="guestId">Guest ID</label>
                    <input type="number" id="guestId" value="${guest.id}" readonly>
                </div>
                <div class="form-group">
                    <label for="guestName">Full Name</label>
                    <input type="text" id="guestName" value="${guest.name}" required>
                </div>
                <div class="form-group">
                    <label for="guestEmail">Email</label>
                    <input type="email" id="guestEmail" value="${guest.email}" required>
                </div>
                <div class="form-group">
                    <label for="guestPhone">Phone</label>
                    <input type="text" id="guestPhone" value="${guest.phone}" required>
                </div>
                <div class="form-buttons">
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="submit" class="save-btn">Update Guest</button>
                </div>
            </form>
        `;
        
        document.querySelector('#editGuestForm .cancel-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        document.getElementById('editGuestForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const updatedGuest = {
                id: parseInt(document.getElementById('guestId').value),
                name: document.getElementById('guestName').value,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value,
                stays: guest.stays // Keep the same number of stays
            };
            
            const index = guests.findIndex(g => g.id === updatedGuest.id);
            if (index !== -1) {
                guests[index] = updatedGuest;
            }
            
            modal.style.display = 'none';
            loadGuests();
        });
        
        modal.style.display = 'block';
    }

    function deleteGuest(guestId) {
        if (confirm('Are you sure you want to delete this guest?')) {
            // Check if guest has any current or upcoming bookings
            if (bookings.some(booking => booking.guestId === guestId && (booking.status === 'current' || booking.status === 'upcoming'))) {
                alert('Cannot delete a guest with current or upcoming bookings!');
                return;
            }
            
            guests = guests.filter(guest => guest.id !== guestId);
            loadGuests();
        }
    }

    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
        // Default to dashboard view
        document.getElementById('dashboardBtn').click();
    });
    
