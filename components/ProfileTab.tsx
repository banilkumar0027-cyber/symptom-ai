'use client';
// components/ProfileTab.tsx — Full version with auth
import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { CONDITION_OPTIONS } from '@/types';
import { calculateStreak } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const supabase = createClient();
  const { profile, entries, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState('');
  const [conditions, setConditions] = useState<string[]>(profile.conditions);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streak = calculateStreak(entries);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setEmail(data.user.email || '');
        setName(data.user.user_metadata?.full_name || profile.name);
        setAvatarUrl(data.user.user_metadata?.avatar_url || null);
      }
    });
  }, []);

  const toggleCondition = (c: string) =>
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Image must be under 2MB');

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);

    setLoadingAvatar(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error('Failed to upload photo');
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } });
      toast.success('Profile photo updated!');
    }
    setLoadingAvatar(false);
  };

  const handleSave = async () => {
    await supabase.auth.updateUser({ data: { full_name: name } });
    updateProfile({ name, conditions });
    setEditing(false);
    toast.success('Profile saved!');
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword)
      return toast.error('Passwords do not match!');
    if (newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success('Password changed successfully!');
      setShowChangePassword(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    toast.error('Contact support to delete your account.');
    setShowDeleteConfirm(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const stats = [
    { label: 'Total Entries', value: entries.length, icon: '📝' },
    { label: 'Current Streak', value: `${streak}d`, icon: '🔥' },
    { label: 'Conditions', value: profile.conditions.length, icon: '🩺' },
    { label: 'Symptom-Free', value: entries.filter(e => e.symptoms.length === 0).length, icon: '✅' },
  ];

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>

      {/* Avatar + Name */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6,214,160,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(6,214,160,0.2)',
        borderRadius: 20, padding: 24, marginBottom: 20, textAlign: 'center',
      }}>
        {/* Avatar */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: displayAvatar ? 'transparent' : 'rgba(6,214,160,0.15)',
            border: '2.5px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, overflow: 'hidden', margin: '0 auto',
          }}>
            {displayAvatar
              ? <img src={displayAvatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '🧬'
            }
          </div>
          {/* Camera button */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={loadingAvatar}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 13,
            }}>
            {loadingAvatar ? '⏳' : '📷'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
        </div>

        {editing ? (
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '8px 16px', color: 'var(--text)',
              fontSize: 18, fontWeight: 700, textAlign: 'center',
              outline: 'none', width: '80%', fontFamily: 'var(--font-display)',
              display: 'block', margin: '0 auto 8px',
            }}
          />
        ) : (
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: 4 }}>
            {name}
          </div>
        )}
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{email}</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Health Conditions */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
          🩺 My Conditions
        </div>
        {editing ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CONDITION_OPTIONS.map(c => (
              <button key={c}
                className={`tag ${conditions.includes(c) ? 'selected-green' : ''}`}
                onClick={() => toggleCondition(c)}>
                {c}
              </button>
            ))}
          </div>
        ) : profile.conditions.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {profile.conditions.map(c => (
              <span key={c} className="tag selected-green">{c}</span>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>No conditions added — tap Edit Profile to add yours.</p>
        )}
      </div>

      {/* Edit / Save */}
      {editing ? (
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <button className="btn-secondary" onClick={() => setEditing(false)} style={{ flex: 1 }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} style={{ flex: 2 }}>💾 Save Changes</button>
        </div>
      ) : (
        <button className="btn-secondary" onClick={() => setEditing(true)} style={{ width: '100%', marginBottom: 14 }}>
          ✏️ Edit Profile
        </button>
      )}

      {/* Change Password */}
      <div className="card" style={{ marginBottom: 14 }}>
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          style={{
            width: '100%', background: 'none', border: 'none',
            color: 'var(--text)', cursor: 'pointer', fontSize: 14,
            fontWeight: 700, textAlign: 'left', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', padding: 0,
          }}>
          <span>🔑 Change Password</span>
          <span style={{ color: 'var(--muted)' }}>{showChangePassword ? '▲' : '▼'}</span>
        </button>

        {showChangePassword && (
          <div style={{ marginTop: 16 }}>
            <input
              type="password" placeholder="New password"
              value={newPassword} onChange={e => setNewPassword(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--text)', fontSize: 14,
                outline: 'none', marginBottom: 10,
              }}
            />
            <input
              type="password" placeholder="Confirm new password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)', borderRadius: 10,
                padding: '11px 14px', color: 'var(--text)', fontSize: 14,
                outline: 'none', marginBottom: 14,
              }}
            />
            <button className="btn-primary" onClick={handleChangePassword}>
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        style={{
          width: '100%', padding: 14, borderRadius: 12,
          border: '1.5px solid var(--border)', background: 'transparent',
          color: 'var(--warn)', cursor: 'pointer', fontSize: 14,
          fontWeight: 700, marginBottom: 14,
          fontFamily: 'var(--font-display)',
        }}>
        🚪 Sign Out
      </button>

      {/* Delete Account */}
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            width: '100%', padding: 14, borderRadius: 12,
            border: '1.5px solid rgba(239,68,68,0.3)', background: 'transparent',
            color: 'var(--danger)', cursor: 'pointer', fontSize: 14,
            fontWeight: 700, fontFamily: 'var(--font-display)',
          }}>
          🗑️ Delete Account
        </button>
      ) : (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 14, padding: 16,
        }}>
          <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 14, lineHeight: 1.6 }}>
            ⚠️ Are you sure? This will permanently delete your account and all health data. This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              style={{
                flex: 1, padding: 13, borderRadius: 12, border: 'none',
                background: 'var(--danger)', color: '#fff',
                fontFamily: 'var(--font-display)', fontSize: 14,
                fontWeight: 700, cursor: 'pointer',
              }}>
              Yes, Delete
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div style={{
        marginTop: 20, padding: 14, background: 'var(--accent-dim)',
        borderRadius: 12, fontSize: 12, color: 'var(--accent)',
        lineHeight: 1.6, textAlign: 'center',
      }}>
        🔒 Your health data is encrypted and stored securely. We never sell your data.
      </div>
    </div>
  );
}
