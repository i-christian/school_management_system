import { test, expect, Page } from '@playwright/test';

import { firstSuperuser, firstSuperuserPassword } from "./config.ts"

test.use({ storageState: { cookies: [], origins: [] } })

type OptionsType = {
  exact?: boolean
}

const fillForm = async (page: Page, email: string, password: string) => {
  await page.getByPlaceholder("Email Address or Phone Number").fill(email)
  await page.getByPlaceholder("Password", { exact: true }).fill(password)
}

const verifyInput = async (
  page: Page,
  placeholder: string,
  options?: OptionsType,
) => {
  const input = page.getByPlaceholder(placeholder, options)
  await expect(input).toBeVisible()
  await expect(input).toHaveText("")
  await expect(input).toBeEditable()
}


test('Creating new user and sign in using this user', async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, firstSuperuser, firstSuperuserPassword)
  await page.getByRole("button", { name: "Sign In" }).click()

  await page.waitForURL(`/admin`)
  await expect(page.getByLabel('Manage Teachers')).toBeVisible();
  await page.getByLabel('Manage Teachers').click();
  await page.getByRole('button', { name: 'Add Users' }).click();
  await page.getByPlaceholder('Full Name').click();
  await page.getByPlaceholder('Full Name').fill('test_teacher');
  await page.getByPlaceholder('Email or Phone').click();
  await page.getByPlaceholder('Email or Phone').fill('teacher@email.com');
  await page.getByLabel('Show Password').click();
  await page.getByLabel('Show Confirm Password').click();
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).fill('123456789');
  await page.getByPlaceholder('Confirm Password').click();
  await page.getByPlaceholder('Confirm Password').fill('123456789');
  await page.getByRole('button', { name: 'Add User', exact: true }).click();
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByPlaceholder('Email Address or Phone Number').click();
  await page.getByPlaceholder('Email Address or Phone Number').fill('teacher@email.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('123456789');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByLabel('View Teachers and Assignments')).toBeVisible();
  await expect(page.getByLabel('View My Classes')).toBeVisible();
  await expect(page.getByLabel('Manage Grades')).toBeVisible();
  await page.getByRole('link', { name: 'User Settings' }).click();
  await page.getByRole('button', { name: 'Appearance' }).click();
  await page.getByRole('switch', { name: 'Toggle dark mode' }).locator('div').first().click();
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
});


test("Update & Delete User", async ({ page }) => {
  await page.goto("/login")

  await fillForm(page, firstSuperuser, firstSuperuserPassword)
  await page.getByRole("button", { name: "Sign In" }).click()

  await page.waitForURL(`/admin`)

  await expect(page.getByLabel('Manage Teachers')).toBeVisible();
  await page.getByLabel('Manage Teachers').click();

  await page.getByRole('row', { name: '1 test_teacher teacher@email.' }).getByRole('button').first().click();
  await page.getByPlaceholder('Enter full name').click();
  await page.getByPlaceholder('Enter full name').fill('test_teacher_1');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('row', { name: '1 test_teacher_1 teacher@' }).getByRole('button').nth(1).click();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('link', { name: 'Sign Out' }).click();
  await page.getByRole('button', { name: 'Confirm' }).click();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByPlaceholder('Email Address or Phone Number').click();
  await page.getByPlaceholder('Email Address or Phone Number').fill('teacher@email.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('123456789');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.locator('form')).toContainText('Incorrect email or password');
})
