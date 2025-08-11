describe('Home - Reminder Flow', () => {
  it('navigates to Reminder Detail screen when tapping a reminder item', async () => {
    // Mở app và đợi Home screen hiển thị
    const homeTitle = $('~title-header-list-reminders');
    await homeTitle.waitForDisplayed({ timeout: 5000 });

    // Kiểm tra list có ít nhất 1 item
    const firstReminderItem = await $('~list-reminder-0');
    await expect(firstReminderItem).toBeDisplayed();

    // Click vào item đầu tiên
    await firstReminderItem.click();

    // Đợi screen detail xuất hiện
    const detailHeader = await $('~title-reminders');
    await detailHeader.waitForDisplayed({ timeout: 5000 });

    // Kiểm tra đúng màn hình detail
    await expect(detailHeader).toHaveText('Kakimi');
  });
});
