/* assets/js/reservation-engine.js - Motor de Reserva do Hotel Manzoni */

(function() {
    'use strict';

    const ReservationEngine = {
        // Configurações do hotel
        hotelConfig: {
            name: 'Hotel Manzoni',
            timezone: 'America/Campo_Grande',
            checkInTime: '14:00',
            checkOutTime: '12:00',
            maxAdvanceBooking: 365, // dias
            minAdvanceBooking: 0    // dias
        },

        // Tipos de quarto disponíveis
        roomTypes: {
            'simples': {
                name: 'Quarto Simples',
                description: 'Ideal para viagens de negócios',
                basePrice: 120.00,
                capacity: 2,
                amenities: ['Wi-Fi', 'TV', 'Ar condicionado', 'Banheiro privativo']
            },
            'duplo': {
                name: 'Quarto Duplo',
                description: 'Conforto para casais',
                basePrice: 150.00,
                capacity: 2,
                amenities: ['Wi-Fi', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Cama queen']
            },
            'suite': {
                name: 'Suíte',
                description: 'Luxo e conforto',
                basePrice: 250.00,
                capacity: 4,
                amenities: ['Wi-Fi', 'TV', 'Ar condicionado', 'Banheiro privativo', 'Cama king', 'Sala de estar']
            }
        },

        // Estado atual
        state: {
            selectedDates: null,
            selectedRoomType: null,
            numberOfGuests: 1,
            currentStep: 'search'
        },

        // Elementos DOM
        elements: {
            reservationForm: null,
            dateInputs: null,
            roomTypeSelect: null,
            guestsInput: null,
            availabilityCalendar: null,
            priceDisplay: null,
            bookingButton: null
        },

        // Inicialização
        init: function() {
            console.log('Motor de Reserva inicializado');
            this.setupElements();
            this.bindEvents();
            this.initializeCalendar();
        },

        // Configurar elementos DOM
        setupElements: function() {
            this.elements.reservationForm = document.getElementById('reservation-form');
            this.elements.dateInputs = document.querySelectorAll('.date-input');
            this.elements.roomTypeSelect = document.getElementById('room-type');
            this.elements.guestsInput = document.getElementById('guests');
            this.elements.availabilityCalendar = document.getElementById('availability-calendar');
            this.elements.priceDisplay = document.getElementById('price-display');
            this.elements.bookingButton = document.getElementById('booking-button');
        },

        // Vincular eventos
        bindEvents: function() {
            if (this.elements.dateInputs) {
                this.elements.dateInputs.forEach(input => {
                    input.addEventListener('change', this.handleDateChange.bind(this));
                });
            }

            if (this.elements.roomTypeSelect) {
                this.elements.roomTypeSelect.addEventListener('change', this.handleRoomTypeChange.bind(this));
            }

            if (this.elements.guestsInput) {
                this.elements.guestsInput.addEventListener('change', this.handleGuestsChange.bind(this));
            }

            if (this.elements.bookingButton) {
                this.elements.bookingButton.addEventListener('click', this.handleBooking.bind(this));
            }
        },

        // Inicializar calendário
        initializeCalendar: function() {
            if (!this.elements.availabilityCalendar) return;

            const today = new Date();
            const maxDate = new Date();
            maxDate.setDate(today.getDate() + this.hotelConfig.maxAdvanceBooking);

            // Configurar datas mínimas e máximas
            this.elements.dateInputs.forEach(input => {
                if (input.name === 'checkin') {
                    input.min = today.toISOString().split('T')[0];
                    input.max = maxDate.toISOString().split('T')[0];
                }
            });
        },

        // Manipular mudança de datas
        handleDateChange: function(event) {
            const checkinInput = document.querySelector('input[name="checkin"]');
            const checkoutInput = document.querySelector('input[name="checkout"]');

            if (event.target.name === 'checkin' && checkoutInput) {
                // Definir data mínima do checkout
                const checkinDate = new Date(event.target.value);
                const minCheckout = new Date(checkinDate);
                minCheckout.setDate(checkinDate.getDate() + 1);
                checkoutInput.min = minCheckout.toISOString().split('T')[0];

                // Se checkout já foi selecionado e é anterior ao checkin + 1 dia
                if (checkoutInput.value && new Date(checkoutInput.value) <= checkinDate) {
                    checkoutInput.value = minCheckout.toISOString().split('T')[0];
                }
            }

            this.updateAvailability();
            this.calculatePrice();
        },

        // Manipular mudança de tipo de quarto
        handleRoomTypeChange: function(event) {
            this.state.selectedRoomType = event.target.value;
            this.updateAvailability();
            this.calculatePrice();
        },

        // Manipular mudança de número de hóspedes
        handleGuestsChange: function(event) {
            this.state.numberOfGuests = parseInt(event.target.value);
            this.updateRoomTypeAvailability();
            this.calculatePrice();
        },

        // Atualizar disponibilidade
        updateAvailability: function() {
            const checkin = document.querySelector('input[name="checkin"]')?.value;
            const checkout = document.querySelector('input[name="checkout"]')?.value;
            const roomType = this.elements.roomTypeSelect?.value;

            if (!checkin || !checkout || !roomType) {
                this.hideAvailability();
                return;
            }

            // Simular verificação de disponibilidade
            this.checkAvailability(checkin, checkout, roomType);
        },

        // Verificar disponibilidade via API
        checkAvailability: async function(checkin, checkout, roomType) {
            try {
                const response = await fetch(`http://localhost:3000/api/availability?checkin_date=${checkin}&checkout_date=${checkout}&room_type=${roomType}`);
                const data = await response.json();
                
                if (data.success) {
                    const isAvailable = data.data.available_rooms[roomType].length > 0;
                    this.showAvailability(isAvailable, data.data);
                    
                    // Se disponível, calcular preço
                    if (isAvailable) {
                        const room = data.data.available_rooms[roomType][0];
                        this.calculatePriceFromAPI(room, data.data.nights);
                    }
                } else {
                    this.showAvailability(false);
                }
            } catch (error) {
                console.error('Erro ao verificar disponibilidade:', error);
                this.showAvailability(false);
            }
        },

        // Mostrar disponibilidade
        showAvailability: function(isAvailable, data = null) {
            if (!this.elements.availabilityCalendar) return;

            if (isAvailable && data) {
                const roomType = this.elements.roomTypeSelect?.value;
                const rooms = data.available_rooms[roomType] || [];
                const nights = data.nights;
                
                let html = '<div class="availability-available">';
                html += `✅ ${rooms.length} quarto(s) disponível(is) para as datas selecionadas<br>`;
                html += `<strong>${nights} ${nights === 1 ? 'noite' : 'noites'}</strong><br>`;
                
                if (rooms.length > 0) {
                    const room = rooms[0];
                    const pricePerNight = room.total_price / nights;
                    html += `<strong>Preço por noite: R$ ${pricePerNight.toFixed(2)}</strong><br>`;
                    html += `<strong>Total: R$ ${room.total_price.toFixed(2)}</strong>`;
                }
                
                html += '</div>';
                this.elements.availabilityCalendar.innerHTML = html;
            } else {
                this.elements.availabilityCalendar.innerHTML = '<div class="availability-unavailable">❌ Quarto não disponível para as datas selecionadas</div>';
            }
            
            this.elements.availabilityCalendar.style.display = 'block';
            
            if (this.elements.bookingButton) {
                this.elements.bookingButton.disabled = !isAvailable;
            }
        },

        // Ocultar disponibilidade
        hideAvailability: function() {
            if (this.elements.availabilityCalendar) {
                this.elements.availabilityCalendar.style.display = 'none';
            }
            if (this.elements.bookingButton) {
                this.elements.bookingButton.disabled = true;
            }
        },

        // Atualizar disponibilidade por tipo de quarto
        updateRoomTypeAvailability: function() {
            const roomType = this.elements.roomTypeSelect?.value;
            const guests = this.state.numberOfGuests;

            if (!roomType || !guests) return;

            const roomConfig = this.roomTypes[roomType];
            if (roomConfig && guests > roomConfig.capacity) {
                this.showAvailability(false);
                if (this.elements.availabilityCalendar) {
                    this.elements.availabilityCalendar.innerHTML = 
                        `<div class="availability-unavailable">❌ Este quarto acomoda no máximo ${roomConfig.capacity} hóspedes</div>`;
                }
            } else {
                // Se a capacidade está ok, verificar disponibilidade real
                const checkin = document.querySelector('input[name="checkin"]')?.value;
                const checkout = document.querySelector('input[name="checkout"]')?.value;
                
                if (checkin && checkout && roomType) {
                    this.checkAvailability(checkin, checkout, roomType);
                }
            }
        },

        // Calcular preço
        calculatePrice: function() {
            const checkin = document.querySelector('input[name="checkin"]')?.value;
            const checkout = document.querySelector('input[name="checkout"]')?.value;
            const roomType = this.elements.roomTypeSelect?.value;

            if (!checkin || !checkout || !roomType) {
                this.hidePrice();
                return;
            }

            const roomConfig = this.roomTypes[roomType];
            if (!roomConfig) return;

            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));

            if (nights <= 0) {
                this.hidePrice();
                return;
            }

            // Calcular preço base + taxas
            let totalPrice = roomConfig.basePrice * nights;
            
            // Aplicar descontos para estadias longas
            if (nights >= 7) {
                totalPrice *= 0.9; // 10% de desconto
            } else if (nights >= 3) {
                totalPrice *= 0.95; // 5% de desconto
            }

            this.displayPrice(totalPrice, nights, roomConfig);
        },

        // Calcular preço a partir da API
        calculatePriceFromAPI: function(room, nights) {
            if (!room || nights <= 0) {
                this.hidePrice();
                return;
            }

            this.displayPrice(room.total_price, nights, {
                name: room.room_type === 'simples' ? 'Quarto Simples' : 
                      room.room_type === 'duplo' ? 'Quarto Duplo' : 'Suíte'
            });
        },

        // Exibir preço
        displayPrice: function(totalPrice, nights, roomConfig) {
            if (!this.elements.priceDisplay) return;

            const pricePerNight = totalPrice / nights;
            
            this.elements.priceDisplay.innerHTML = `
                <div class="price-breakdown">
                    <h4>Resumo da Reserva</h4>
                    <div class="price-item">
                        <span>${roomConfig.name}</span>
                        <span>${nights} ${nights === 1 ? 'noite' : 'noites'}</span>
                    </div>
                    <div class="price-item">
                        <span>Preço por noite</span>
                        <span>R$ ${pricePerNight.toFixed(2)}</span>
                    </div>
                    <div class="price-item total">
                        <span>Total</span>
                        <span>R$ ${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            `;
            
            this.elements.priceDisplay.style.display = 'block';
        },

        // Ocultar preço
        hidePrice: function() {
            if (this.elements.priceDisplay) {
                this.elements.priceDisplay.style.display = 'none';
            }
        },

        // Manipular reserva
        handleBooking: function() {
            const formData = this.collectFormData();
            
            if (!this.validateForm(formData)) {
                return;
            }

            this.processBooking(formData);
        },

        // Coletar dados do formulário
        collectFormData: function() {
            const form = this.elements.reservationForm;
            if (!form) {
                console.error('❌ Formulário não encontrado');
                return null;
            }

            const formData = new FormData(form);
            const data = {};

            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            console.log('📝 Dados coletados do formulário:', data);

            // Mapear campos do frontend para o backend
            const mappedData = {
                guest_name: data.name,
                guest_email: data.email,
                guest_phone: data.phone,
                guest_cpf: data.cpf,
                checkin_date: data.checkin,
                checkout_date: data.checkout,
                guests_count: parseInt(data.guests),
                room_type: data.room_type,
                observations: data.observations || ''
            };

            console.log('🔄 Dados mapeados:', mappedData);
            return mappedData;
        },

        // Validar formulário
        validateForm: function(data) {
            console.log('🔍 Validando dados:', data);
            const errors = [];

            if (!data.checkin_date) errors.push('Data de entrada é obrigatória');
            if (!data.checkout_date) errors.push('Data de saída é obrigatória');
            if (!data.room_type) errors.push('Tipo de quarto é obrigatório');
            if (!data.guests_count || data.guests_count < 1) errors.push('Número de hóspedes é obrigatório');
            if (!data.guest_name) errors.push('Nome é obrigatório');
            if (!data.guest_email) errors.push('Email é obrigatório');
            if (!data.guest_phone) errors.push('Telefone é obrigatório');

            if (errors.length > 0) {
                console.error('❌ Erros de validação:', errors);
                this.showErrors(errors);
                return false;
            }

            console.log('✅ Validação aprovada');
            return true;
        },

        // Mostrar erros
        showErrors: function(errors) {
            const errorContainer = document.getElementById('booking-errors');
            if (!errorContainer) return;

            errorContainer.innerHTML = `
                <div class="error-message">
                    <h4>Por favor, corrija os seguintes erros:</h4>
                    <ul>
                        ${errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                </div>
            `;
            errorContainer.style.display = 'block';
        },

        // Processar reserva
        processBooking: async function(data) {
            this.showLoading(true);
            
            try {
                console.log('📤 Enviando dados para reserva:', data);
                
                const response = await fetch('http://localhost:3000/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                console.log('📥 Status da resposta:', response.status);
                
                const result = await response.json();
                console.log('📊 Resposta da API:', result);
                
                this.showLoading(false);
                
                if (result.success) {
                    this.showBookingConfirmation(result.data);
                } else {
                    console.error('❌ Erro na API:', result);
                    this.showErrors([result.error || 'Erro ao processar reserva']);
                }
            } catch (error) {
                console.error('❌ Erro ao processar reserva:', error);
                this.showLoading(false);
                this.showErrors(['Erro de conexão. Tente novamente.']);
            }
        },

        // Mostrar loading
        showLoading: function(show) {
            if (this.elements.bookingButton) {
                this.elements.bookingButton.disabled = show;
                this.elements.bookingButton.textContent = show ? 'Processando...' : 'Fazer Reserva';
            }
        },

        // Mostrar confirmação
        showBookingConfirmation: function(data) {
            const confirmationContainer = document.getElementById('booking-confirmation');
            if (!confirmationContainer) return;

            const totalPrice = data.total_price.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            confirmationContainer.innerHTML = `
                <div class="confirmation-message">
                    <h3>✅ Reserva Confirmada!</h3>
                    <p>Olá ${data.guest_name}, sua reserva foi processada com sucesso!</p>
                    <div class="confirmation-details">
                        <p><strong>Número da Reserva:</strong> ${data.booking_number}</p>
                        <p><strong>Check-in:</strong> ${new Date(data.checkin_date).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Check-out:</strong> ${new Date(data.checkout_date).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Quarto:</strong> ${data.room_type}</p>
                        <p><strong>Hóspedes:</strong> ${data.guests_count}</p>
                        <p><strong>Noites:</strong> ${data.nights}</p>
                        <p><strong>Valor Total:</strong> ${totalPrice}</p>
                    </div>
                    <p>Um email de confirmação foi enviado para ${data.guest_email}</p>
                    <p><strong>Importante:</strong> Apresente este número de reserva no check-in</p>
                </div>
            `;
            
            confirmationContainer.style.display = 'block';
            
            // Limpar formulário
            if (this.elements.reservationForm) {
                this.elements.reservationForm.reset();
            }
        },

        // Gerar número da reserva
        generateBookingNumber: function() {
            const timestamp = Date.now();
            const random = Math.floor(Math.random() * 1000);
            return `HM${timestamp}${random}`;
        }
    };

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ReservationEngine.init.bind(ReservationEngine));
    } else {
        ReservationEngine.init();
    }

    // Expor para uso global
    window.ReservationEngine = ReservationEngine;

})(); 