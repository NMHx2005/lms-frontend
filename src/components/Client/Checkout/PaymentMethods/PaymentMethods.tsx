import React, { useState } from 'react';
import './PaymentMethods.css';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  fee: number;
  processingTime: string;
}

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedMethod, onMethodSelect }) => {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'credit-card',
      name: 'Thẻ tín dụng/ghi nợ',
      description: 'Visa, Mastercard, JCB, American Express',
      icon: '💳',
      fee: 0,
      processingTime: 'Ngay lập tức'
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản qua Internet Banking',
      icon: '🏦',
      fee: 0,
      processingTime: '1-2 giờ làm việc'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: '📱',
      fee: 0,
      processingTime: 'Ngay lập tức'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Thanh toán qua ZaloPay',
      icon: '💙',
      fee: 0,
      processingTime: 'Ngay lập tức'
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Cổng thanh toán VNPay',
      icon: '🇻🇳',
      fee: 0,
      processingTime: 'Ngay lập tức'
    }
  ];

  const handleMethodClick = (methodId: string) => {
    onMethodSelect(methodId);
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  return (
    <div className="payment-methods">
      <h3 className="payment-methods__title">Chọn phương thức thanh toán</h3>
      
      <div className="payment-methods__list">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`payment-methods__item ${
              selectedMethod === method.id ? 'payment-methods__item--selected' : ''
            }`}
            onClick={() => handleMethodClick(method.id)}
          >
            <div className="payment-methods__item-header">
              <div className="payment-methods__item-info">
                <div className="payment-methods__item-icon">{method.icon}</div>
                <div className="payment-methods__item-details">
                  <h4 className="payment-methods__item-name">{method.name}</h4>
                  <p className="payment-methods__item-description">{method.description}</p>
                </div>
              </div>
              
              <div className="payment-methods__item-radio">
                <input
                  type="radio"
                  name="payment-method"
                  id={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => onMethodSelect(method.id)}
                />
                <label htmlFor={method.id}></label>
              </div>
            </div>

            {expandedMethod === method.id && (
              <div className="payment-methods__item-details-expanded">
                <div className="payment-methods__item-fee">
                  <span>Phí giao dịch:</span>
                  <span className={method.fee === 0 ? 'fee-free' : 'fee-charged'}>
                    {method.fee === 0 ? 'Miễn phí' : `${method.fee.toLocaleString('vi-VN')} VND`}
                  </span>
                </div>
                <div className="payment-methods__item-processing">
                  <span>Thời gian xử lý:</span>
                  <span>{method.processingTime}</span>
                </div>
                
                {method.id === 'credit-card' && (
                  <div className="payment-methods__card-form">
                    <div className="payment-methods__form-row">
                      <div className="payment-methods__form-group">
                        <label htmlFor="card-number">Số thẻ</label>
                        <input
                          type="text"
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div className="payment-methods__form-row">
                      <div className="payment-methods__form-group">
                        <label htmlFor="card-expiry">Ngày hết hạn</label>
                        <input
                          type="text"
                          id="card-expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="payment-methods__form-group">
                        <label htmlFor="card-cvv">CVV</label>
                        <input
                          type="text"
                          id="card-cvv"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="payment-methods__form-row">
                      <div className="payment-methods__form-group">
                        <label htmlFor="card-holder">Tên chủ thẻ</label>
                        <input
                          type="text"
                          id="card-holder"
                          placeholder="NGUYEN VAN A"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="payment-methods__security">
        <div className="payment-methods__security-icon">🔒</div>
        <div className="payment-methods__security-text">
          <strong>Thanh toán an toàn</strong>
          <p>Tất cả giao dịch được mã hóa SSL và bảo vệ bởi các tiêu chuẩn bảo mật quốc tế</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
