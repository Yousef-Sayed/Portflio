"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ui/toast";
import { Loader2, Mail, Lock, LogOut } from "lucide-react";

interface UserInfo {
  id: string;
  email: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

function ProfileContent() {
  const { language, direction } = useLanguage();
  const router = useRouter();
  const { addToast } = useToast();
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Email update state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Convex actions
  const validateSession = useAction(api.authActions.validateSession);
  const updateEmail = useAction(api.authActions.updateEmail);
  const updatePassword = useAction(api.authActions.updatePassword);
  const logout = useAction(api.authActions.logout);

  // Initialize session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    setSessionToken(token);
    
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Validate session on mount
  useEffect(() => {
    if (!sessionToken) return;

    const checkSession = async () => {
      try {
        const result = await validateSession({ sessionToken });
        if (result.valid && result.user) {
          setUserInfo(result.user as UserInfo);
        } else {
          localStorage.removeItem("sessionToken");
          router.push("/login");
        }
      } catch (error) {
        console.error("Session validation error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [sessionToken, validateSession, router]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);

    if (!sessionToken) {
      addToast("Session expired. Please log in again.", "error");
      setEmailLoading(false);
      return;
    }

    if (!newEmail) {
      addToast("Please enter a new email address.", "error");
      setEmailLoading(false);
      return;
    }

    if (newEmail === userInfo?.email) {
      addToast("New email is the same as current email.", "error");
      setEmailLoading(false);
      return;
    }

    const result: ActionResult = await updateEmail({ sessionToken, newEmail });
    
    if (result.success) {
      addToast(result.message || "Email updated successfully", "success");
      setNewEmail("");
      setTimeout(() => {
        localStorage.removeItem("sessionToken");
        router.push("/login");
      }, 2000);
    } else {
      addToast(result.error || "Failed to update email", "error");
    }
    
    setEmailLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (!sessionToken) {
      addToast("Session expired. Please log in again.", "error");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("New passwords do not match.", "error");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      addToast("New password must be at least 8 characters.", "error");
      setPasswordLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      addToast("New password must be different from current password.", "error");
      setPasswordLoading(false);
      return;
    }

    const result: ActionResult = await updatePassword({ 
      sessionToken, 
      currentPassword, 
      newPassword 
    });
    
    if (result.success) {
      addToast(result.message || "Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        localStorage.removeItem("sessionToken");
        router.push("/login");
      }, 2000);
    } else {
      addToast(result.error || "Failed to update password", "error");
    }
    
    setPasswordLoading(false);
  };

  const handleLogout = async () => {
    if (sessionToken) {
      try {
        await logout({ sessionToken });
      } finally {
        localStorage.removeItem("sessionToken");
        router.push("/login");
      }
    }
  };

  const translations = {
    en: {
      title: "Profile Settings",
      description: "Manage your account settings and security",
      emailSection: "Email Address",
      emailDescription: "Change your email address",
      currentEmail: "Current email",
      newEmail: "New email",
      updateEmail: "Update Email",
      updating: "Updating...",
      passwordSection: "Password",
      passwordDescription: "Change your password",
      currentPassword: "Current password",
      newPassword: "New password",
      confirmPassword: "Confirm new password",
      updatePassword: "Update Password",
      minLength: "Minimum 8 characters",
      logout: "Logout",
      logoutDesc: "Sign out of your account",
    },
    ar: {
      title: "إعدادات الملف الشخصي",
      description: "إدارة إعدادات حسابك والأمان",
      emailSection: "البريد الإلكتروني",
      emailDescription: "تغيير عنوان بريدك الإلكتروني",
      currentEmail: "البريد الإلكتروني الحالي",
      newEmail: "البريد الإلكتروني الجديد",
      updateEmail: "تحديث البريد الإلكتروني",
      updating: "جاري التحديث...",
      passwordSection: "كلمة المرور",
      passwordDescription: "تغيير كلمة المرور",
      currentPassword: "كلمة المرور الحالية",
      newPassword: "كلمة المرور الجديدة",
      confirmPassword: "تأكيد كلمة المرور الجديدة",
      updatePassword: "تحديث كلمة المرور",
      minLength: "الحد الأدنى 8 أحرف",
      logout: "تسجيل الخروج",
      logoutDesc: "الخروج من حسابك",
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Email Update Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>{t.emailSection}</CardTitle>
          </div>
          <CardDescription>{t.emailDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.currentEmail}</Label>
              <Input 
                value={userInfo?.email || ""} 
                disabled 
                className="bg-muted"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newEmail">{t.newEmail}</Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="new@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={emailLoading || !newEmail}>
              {emailLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.updating}
                </>
              ) : (
                t.updateEmail
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Password Update Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>{t.passwordSection}</CardTitle>
          </div>
          <CardDescription>{t.passwordDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t.currentPassword}</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">{t.newPassword}</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">{t.minLength}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={passwordLoading || !currentPassword || !newPassword}>
              {passwordLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.updating}
                </>
              ) : (
                t.updatePassword
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Logout Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            <CardTitle>{t.logout}</CardTitle>
          </div>
          <CardDescription>{t.logoutDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t.logout}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}
