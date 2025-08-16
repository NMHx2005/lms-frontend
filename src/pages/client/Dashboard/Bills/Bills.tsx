import React, { useState, useEffect } from 'react';
import { Bill } from '@/components/Client/Dashboard/types';
import './Bills.css';

const Bills: React.FC = () => {
  const [billsData, setBillsData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockData: Bill[] = [
        {
          _id: 'bill_001',
          studentId: 'student_001',
          courseId: 'course_001',
          amount: 500000,
          currency: 'VND',
          paymentMethod: 'stripe',
          status: 'completed',
          transactionId: 'txn_123456789',
          purpose: 'course_purchase',
          paidAt: '2025-01-15T10:30:00Z',
          createdAt: '2025-01-15T10:25:00Z',
          updatedAt: '2025-01-15T10:30:00Z'
        },
        {
          _id: 'bill_002',
          studentId: 'student_001',
          courseId: 'course_002',
          amount: 800000,
          currency: 'VND',
          paymentMethod: 'momo',
          status: 'pending',
          transactionId: 'txn_123456790',
          paidAt: '2025-01-15T10:30:00Z',
          purpose: 'course_purchase',
          createdAt: '2025-01-14T14:20:00Z',
          updatedAt: '2025-01-14T14:20:00Z'
        },
        {
          _id: 'bill_003',
          studentId: 'student_001',
          courseId: 'course_003',
          amount: 600000,
          currency: 'VND',
          paymentMethod: 'zalopay',
          status: 'failed',
          paidAt: '2025-01-15T10:30:00Z',
          transactionId: 'txn_123456791',
          purpose: 'course_purchase',
          createdAt: '2025-01-13T09:15:00Z',
          updatedAt: '2025-01-13T09:20:00Z'
        },
        {
          _id: 'bill_004',
          studentId: 'student_001',
          courseId: 'course_004',
          amount: 700000,
          currency: 'VND',
          paymentMethod: 'bank_transfer',
          status: 'refunded',
          transactionId: 'txn_123456792',
          purpose: 'refund',
          paidAt: '2025-01-12T08:10:00Z',
          createdAt: '2025-01-12T08:10:00Z',
          updatedAt: '2025-01-20T10:00:00Z'
        }
      ];
      setBillsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: Bill['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Đang xử lý';
      case 'failed':
        return 'Thất bại';
      case 'refunded':
        return 'Đã hoàn tiền';
      default:
        return status;
    }
  };

  const getStatusClass = (status: Bill['status']) => {
    switch (status) {
      case 'completed':
        return 'dashboard__status-badge--completed';
      case 'pending':
        return 'dashboard__status-badge--pending';
      case 'failed':
        return 'dashboard__status-badge--failed';
      case 'refunded':
        return 'dashboard__status-badge--refunded';
      default:
        return '';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'stripe':
        return 'Thẻ tín dụng (Stripe)';
      case 'momo':
        return 'Ví MoMo';
      case 'zalopay':
        return 'Ví ZaloPay';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
    }
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case 'course_purchase':
        return 'Mua khóa học';
      case 'subscription':
        return 'Đăng ký gói';
      case 'refund':
        return 'Hoàn tiền';
      default:
        return purpose;
    }
  };

  const getFilteredBills = () => {
    if (!billsData) return [];

    switch (selectedFilter) {
      case 'pending':
        return billsData.filter((bill) => bill.status === 'pending');
      case 'completed':
        return billsData.filter((bill) => bill.status === 'completed');
      case 'failed':
        return billsData.filter((bill) => bill.status === 'failed');
      case 'refunded':
        return billsData.filter((bill) => bill.status === 'refunded');
      default:
        return billsData;
    }
  };

  // Tính toán stats từ billsData array
  const totalAmount = billsData.reduce((sum, bill) => sum + bill.amount, 0);
  const completedAmount = billsData.filter(bill => bill.status === 'completed').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = billsData.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const failedAmount = billsData.filter(bill => bill.status === 'failed').reduce((sum, bill) => sum + bill.amount, 0);
  const refundedAmount = billsData.filter(bill => bill.status === 'refunded').reduce((sum, bill) => sum + bill.amount, 0);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Hóa đơn & Thanh toán</span>
          </div>
          <h1 className="dashboard__title">Hóa đơn & Thanh toán</h1>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!billsData) {
    return (
      <div className="dashboard">
        <div className="dashboard__header">
          <div className="dashboard__breadcrumbs">
            <span>Dashboard</span>
            <span>/</span>
            <span>Hóa đơn & Thanh toán</span>
          </div>
          <h1 className="dashboard__title">Hóa đơn & Thanh toán</h1>
        </div>
        <div className="dashboard__content">
          <div className="dashboard__error">
            <h2>Không thể tải dữ liệu</h2>
            <p>Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <span>Dashboard</span>
          <span>/</span>
          <span>Hóa đơn & Thanh toán</span>
        </div>
        <h1 className="dashboard__title">Hóa đơn & Thanh toán</h1>
      </div>

      {/* Content */}
      <div className="dashboard__content">
        {/* Stats Overview */}
        <div className="dashboard__bills-stats">
          <div className="dashboard__bills-stat">
            <div className="dashboard__bills-stat-icon">💰</div>
            <div className="dashboard__bills-stat-content">
              <h4>Tổng giao dịch</h4>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <div className="dashboard__bills-stat">
            <div className="dashboard__bills-stat-icon">✅</div>
            <div className="dashboard__bills-stat-content">
              <h4>Đã hoàn thành</h4>
              <span>{formatPrice(completedAmount)}</span>
            </div>
          </div>

          <div className="dashboard__bills-stat">
            <div className="dashboard__bills-stat-icon">⏳</div>
            <div className="dashboard__bills-stat-content">
              <h4>Đang xử lý</h4>
              <span>{formatPrice(pendingAmount)}</span>
            </div>
          </div>

          <div className="dashboard__bills-stat">
            <div className="dashboard__bills-stat-icon">❌</div>
            <div className="dashboard__bills-stat-content">
              <h4>Thất bại</h4>
              <span>{formatPrice(failedAmount)}</span>
            </div>
          </div>

          <div className="dashboard__bills-stat">
            <div className="dashboard__bills-stat-icon">🔄</div>
            <div className="dashboard__bills-stat-content">
              <h4>Đã hoàn tiền</h4>
              <span>{formatPrice(refundedAmount)}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            Tất cả ({billsData.length})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('completed')}
          >
            Hoàn thành ({billsData.filter((bill) => bill.status === 'completed').length})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('pending')}
          >
            Đang xử lý ({billsData.filter((bill) => bill.status === 'pending').length})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'failed' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('failed')}
          >
            Thất bại ({billsData.filter((bill) => bill.status === 'failed').length})
          </button>
          <button
            className={`dashboard__tab ${selectedFilter === 'refunded' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('refunded')}
          >
            Đã hoàn tiền ({billsData.filter((bill) => bill.status === 'refunded').length})
          </button>
        </div>

        {/* Bills List */}
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h2>Danh sách hóa đơn</h2>
            <p>Quản lý tất cả giao dịch thanh toán của bạn</p>
          </div>

          {getFilteredBills().length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">💰</div>
              <h3>Không có hóa đơn nào</h3>
              <p>Bạn chưa có giao dịch thanh toán nào</p>
            </div>
          ) : (
            <div className="dashboard__bills-list">
              {getFilteredBills().map((bill) => (
                <div key={bill._id} className="dashboard__bill-card">
                  <div className="dashboard__bill-header">
                    <div className="dashboard__bill-info">
                      <h4>Giao dịch #{bill.transactionId}</h4>
                      <p>Mục đích: {getPurposeLabel(bill.purpose)}</p>
                      <span className="dashboard__bill-date">{formatDate(bill.createdAt)}</span>
                    </div>
                    <div className="dashboard__bill-amount">
                      <span className="dashboard__bill-price">{formatPrice(bill.amount)}</span>
                      <span className={`dashboard__status-badge ${getStatusClass(bill.status)}`}>
                        {getStatusLabel(bill.status)}
                      </span>
                    </div>
                  </div>

                  <div className="dashboard__bill-details">
                    <div className="dashboard__bill-method">
                      <strong>Phương thức:</strong> {getPaymentMethodLabel(bill.paymentMethod)}
                    </div>
                    {bill.paidAt && (
                      <div className="dashboard__bill-paid">
                        <strong>Thanh toán:</strong> {formatDate(bill.paidAt)}
                      </div>
                    )}
                    {/* {bill.refundedAt && (
                      <div className="dashboard__bill-refunded">
                        <strong>Hoàn tiền:</strong> {formatDate(bill.refundedAt)}
                      </div>
                    )} */}
                  </div>

                  <div className="dashboard__bill-actions">
                    <button className="dashboard__btn dashboard__btn--outline">
                      <span>👁️</span>
                      Xem chi tiết
                    </button>
                    {bill.status === 'pending' && (
                      <button className="dashboard__btn dashboard__btn--primary">
                        <span>💳</span>
                        Thanh toán ngay
                      </button>
                    )}
                    {bill.status === 'failed' && (
                      <button className="dashboard__btn dashboard__btn--secondary">
                        <span>🔄</span>
                        Thử lại
                      </button>
                    )}
                    {bill.status === 'completed' && (
                      <button className="dashboard__btn dashboard__btn--outline">
                        <span>📄</span>
                        Tải hóa đơn
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;