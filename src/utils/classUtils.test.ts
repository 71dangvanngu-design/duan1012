import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDaysTogether,
  calculateZodiac,
  removeVietnameseAccents,
  filterMembers,
  getDaysUntilEvent,
  formatVietnameseDate,
} from './classUtils';
import { Member } from '../types';

test('calculateDaysTogether accurately computes elapsed calendar days', () => {
  const start = '2024-09-05';
  const refDate = new Date('2024-09-15T12:00:00Z');
  const days = calculateDaysTogether(start, refDate);
  assert.equal(days, 10);
});

test('calculateZodiac returns correct zodiac for different dates', () => {
  assert.equal(calculateZodiac('2009-03-25'), 'Bạch Dương (Aries)');
  assert.equal(calculateZodiac('2009-08-15'), 'Sư Tử (Leo)');
  assert.equal(calculateZodiac('2009-11-20'), 'Bọ Cạp (Scorpio)');
  assert.equal(calculateZodiac('2009-12-25'), 'Ma Kết (Capricorn)');
});

test('removeVietnameseAccents strips diacritics correctly', () => {
  assert.equal(removeVietnameseAccents('Nguyễn Văn Đức'), 'nguyen van duc');
  assert.equal(removeVietnameseAccents('Đặng Thị Thảo'), 'dang thi thao');
  assert.equal(removeVietnameseAccents('10/12 Thanh Xuân'), '10/12 thanh xuan');
});

test('filterMembers filters by search term and team filter', () => {
  const mockList: Member[] = [
    {
      id: '1',
      name: 'Nguyễn Minh Quân',
      nickname: 'Quân Cận',
      role: 'Lớp trưởng',
      team: 'Ban cán sự',
      avatar: 'https://example.com/1.jpg',
      birthday: '2009-05-12',
      quote: 'Cố gắng hết mình',
      hobbies: ['Đọc sách', 'Bóng rổ'],
    },
    {
      id: '2',
      name: 'Trần Thị Thu Hà',
      nickname: 'Hà Mây',
      role: 'Thành viên',
      team: 'Tổ 1',
      avatar: 'https://example.com/2.jpg',
      birthday: '2009-08-20',
      quote: 'Yêu đời',
      hobbies: ['Vẽ tranh', 'Bơi lội'],
    },
    {
      id: '3',
      name: 'Lê Hoàng Nam',
      nickname: 'Nam Béo',
      role: 'Tổ trưởng',
      team: 'Tổ 2',
      avatar: 'https://example.com/3.jpg',
      birthday: '2009-11-04',
      quote: 'Học chơi cân bằng',
      hobbies: ['Chơi game', 'Guitar'],
    },
  ];

  // Search by accented / unaccented name
  const res1 = filterMembers(mockList, 'quan', 'Tất cả');
  assert.equal(res1.length, 1);
  assert.equal(res1[0].name, 'Nguyễn Minh Quân');

  // Search by nickname
  const res2 = filterMembers(mockList, 'Mây', 'Tất cả');
  assert.equal(res2.length, 1);
  assert.equal(res2[0].nickname, 'Hà Mây');

  // Filter by team
  const res3 = filterMembers(mockList, '', 'Tổ 1');
  assert.equal(res3.length, 1);
  assert.equal(res3[0].name, 'Trần Thị Thu Hà');

  // Search by hobby
  const res4 = filterMembers(mockList, 'guitar', 'Tất cả');
  assert.equal(res4.length, 1);
  assert.equal(res4[0].name, 'Lê Hoàng Nam');
});

test('getDaysUntilEvent calculates remaining days correctly', () => {
  const ref = new Date('2025-03-20T00:00:00Z');
  const days = getDaysUntilEvent('2025-03-26', ref);
  assert.equal(days, 6);
});

test('formatVietnameseDate formats correctly', () => {
  assert.equal(formatVietnameseDate('2024-11-20'), '20/11/2024');
});
