import React, { useState } from 'react';
import { updateMyPageInfo } from '../api/mypageApi';

//1
function MyPageUpdate({ user, field, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    
    const cusUserRaw = localStorage.getItem('CusUser');
    const cusUser = cusUserRaw ? JSON.parse(cusUserRaw) : null;
    const userId = cusUser?.id;
    
    let patchData = {};
    if (field === 'info') {
      patchData = { name: form.name, email: form.email, phone: form.phone };
    } else if (field === 'address') {
      patchData = { address: form.address };
    }
    
    const result = await updateMyPageInfo(userId, patchData);
    if (result.success) {
      onUpdate({ ...user, ...patchData });
      onClose();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{marginTop: 16}}>
      {field === 'info' && (
        <>
          <div className="mypage-info-row">
            <label>닉네임</label>
            <input name="name" value={form.name} onChange={handleChange} />
            <label>이메일</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="mypage-info-row">
            <label>휴대폰 번호</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
        </>
      )}
      {field === 'address' && (
        <div className="mypage-info-row">
          <label>배송지</label>
          <input name="address" value={form.address} onChange={handleChange} />
        </div>
      )}
      <button className="mypage-btn" onClick={handleSave} disabled={loading}>저장</button>
      <button className="mypage-btn" onClick={onClose} disabled={loading}>취소</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </div>
  );
}

export default MyPageUpdate; 