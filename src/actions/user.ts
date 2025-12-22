'use server'

import { db } from '../lib/db';
import { revalidatePath } from 'next/cache';
import { hash, compare } from 'bcryptjs';

// 1. Update Profile (Name & Email)
export async function updateProfile(formData: FormData) {
  const currentEmail = formData.get('currentEmail') as string; // Who is logged in
  const newEmail = formData.get('email') as string;            // What they want to change to
  const name = formData.get('name') as string;
  
  try {
    // If changing email, check if it's already taken by someone else
    if (newEmail !== currentEmail) {
      const existingUser = await db.user.findUnique({
        where: { email: newEmail }
      });
      if (existingUser) {
        return { success: false, message: "This email is already in use." };
      }
    }

    await db.user.update({
      where: { email: currentEmail },
      data: { 
        name,
        email: newEmail 
      },
    });

    revalidatePath('/dashboard/settings');
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update profile." };
  }
}

// 2. Update Password
export async function updatePassword(email: string, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match." };
  }

  try {
    // Fetch the user to get their hashed password
    const user = await db.user.findUnique({ where: { email } });

    if (!user) return { success: false, message: "User not found." };

    // Verify the OLD password
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Incorrect current password." };
    }

    // Hash the NEW password
    const hashedPassword = await hash(newPassword, 12);

    // Save to DB
    await db.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to update password." };
  }
}