# Client Services - Wishlist Integration

## Tổng quan
Dịch vụ wishlist cung cấp các chức năng để quản lý danh sách khóa học yêu thích của người dùng.

## Cài đặt và Sử dụng

### Import Service
```typescript
import { wishlistService } from '../services/client/wishlist.service';
```

### Các chức năng chính

#### 1. Lấy danh sách wishlist
```typescript
const wishlist = await wishlistService.getWishlist({
  page: 1,
  limit: 20,
  sortBy: 'addedAt',
  sortOrder: 'desc',
  category: 'Web Development',
  search: 'React'
});
```

#### 2. Thêm khóa học vào wishlist
```typescript
const result = await wishlistService.addToWishlist({
  courseId: 'course123',
  notes: 'Khóa học rất hay!'
});
```

#### 3. Xóa khóa học khỏi wishlist
```typescript
const result = await wishlistService.removeFromWishlist('wishlistItem123');
```

#### 4. Cập nhật ghi chú
```typescript
const result = await wishlistService.updateWishlistItem('wishlistItem123', {
  notes: 'Ghi chú mới'
});
```

#### 5. Kiểm tra khóa học có trong wishlist
```typescript
const result = await wishlistService.isInWishlist('course123');
if (result.data.isInWishlist) {
  console.log('Khóa học đã có trong wishlist');
}
```

#### 6. Xóa toàn bộ wishlist
```typescript
const result = await wishlistService.clearWishlist();
```

#### 7. Chuyển khóa học vào giỏ hàng
```typescript
const result = await wishlistService.moveToCart('wishlistItem123');
```

#### 8. Lấy thống kê wishlist
```typescript
const stats = await wishlistService.getWishlistStats();
console.log(`Tổng số khóa học: ${stats.data.totalItems}`);
console.log(`Tổng giá trị: $${stats.data.totalValue}`);
console.log(`Số khóa học giảm giá: ${stats.data.onSaleCount}`);
```

## API Endpoints

### GET `/client/wishlist`
- **Mô tả**: Lấy danh sách wishlist của người dùng
- **Tham số**: 
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số item mỗi trang (mặc định: 20)
  - `sortBy`: Sắp xếp theo (addedAt, price, rating, title)
  - `sortOrder`: Thứ tự sắp xếp (asc, desc)
  - `category`: Lọc theo danh mục
  - `search`: Tìm kiếm theo tên khóa học

### POST `/client/wishlist`
- **Mô tả**: Thêm khóa học vào wishlist
- **Body**: `{ courseId: string, notes?: string }`

### DELETE `/client/wishlist/{wishlistId}`
- **Mô tả**: Xóa khóa học khỏi wishlist

### PUT `/client/wishlist/{wishlistId}`
- **Mô tả**: Cập nhật thông tin wishlist item
- **Body**: `{ notes?: string }`

### GET `/client/wishlist/check/{courseId}`
- **Mô tả**: Kiểm tra khóa học có trong wishlist không

### DELETE `/client/wishlist/clear`
- **Mô tả**: Xóa toàn bộ wishlist

### POST `/client/wishlist/{wishlistId}/move-to-cart`
- **Mô tả**: Chuyển khóa học từ wishlist vào giỏ hàng

### GET `/client/wishlist/stats`
- **Mô tả**: Lấy thống kê wishlist

## Xử lý lỗi

Tất cả các API calls đều có xử lý lỗi tích hợp:

```typescript
try {
  const result = await wishlistService.addToWishlist(data);
  if (result.success) {
    toast.success('Thêm vào wishlist thành công!');
  } else {
    toast.error(result.message || 'Có lỗi xảy ra');
  }
} catch (error: any) {
  const errorMessage = error?.response?.data?.message || 'Lỗi mạng';
  toast.error(errorMessage);
  console.error('Error:', error);
}
```

## Types và Interfaces

### WishlistItem
```typescript
interface WishlistItem {
  _id: string;
  courseId: string;
  title: string;
  thumbnail: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalStudents: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  addedAt: string;
  isOnSale: boolean;
  discountPercentage?: number;
}
```

### WishlistResponse
```typescript
interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}
```

## Lưu ý

1. **Authentication**: Tất cả API calls đều yêu cầu xác thực người dùng
2. **Error Handling**: Luôn sử dụng try-catch để xử lý lỗi
3. **Loading States**: Sử dụng loading state để cải thiện UX
4. **Toast Notifications**: Sử dụng toast để thông báo kết quả cho người dùng
5. **Optimistic Updates**: Có thể cập nhật UI trước khi API call hoàn thành để UX mượt mà hơn

## Ví dụ sử dụng trong Component

```typescript
import React, { useState, useEffect } from 'react';
import { wishlistService } from '../services/client/wishlist.service';
import { toast } from 'react-hot-toast';

const WishlistComponent = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlist(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await wishlistService.removeFromWishlist(id);
      if (response.success) {
        setWishlist(prev => prev.filter(item => item._id !== id));
        toast.success('Đã xóa khỏi wishlist');
      }
    } catch (error) {
      toast.error('Không thể xóa item');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      {wishlist.map(item => (
        <div key={item._id}>
          <h3>{item.title}</h3>
          <button onClick={() => removeItem(item._id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
};
```
