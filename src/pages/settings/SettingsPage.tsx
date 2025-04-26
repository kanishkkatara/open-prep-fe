// src/pages/SettingsPage.tsx
import React, { useState, useEffect, FormEvent } from "react";
import {
  getBasicSettings,
  updateBasicSettings,
  getNotificationSettings,
  updateNotificationSettings,
} from "../../lib/api";
import { BasicSettings, NotificationSettings } from "../../lib/types";

export default function SettingsPage() {
  const [basic, setBasic] = useState<BasicSettings>({
    name: "",
    email: "",
    target_score: 700,
    exam_date: null,
    previous_score: null,
  });
  const [notify, setNotify] = useState<NotificationSettings>({
    notify_mail: false,
    notify_whatsapp: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [b, n] = await Promise.all([
          getBasicSettings(),
          getNotificationSettings(),
        ]);
        setBasic({ ...b, exam_date: b.exam_date?.slice(0, 10) ?? null });
        setNotify(n);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleBasicSave = async (e: FormEvent) => {
    e.preventDefault();
    await updateBasicSettings(basic);
    alert("Basic details saved.");
  };

  const handleNotifySave = async (e: FormEvent) => {
    e.preventDefault();
    await updateNotificationSettings({
      notify_mail: notify.notify_mail,
      notify_whatsapp: false,
    });
    alert("Notification settings saved.");
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8 text-gray-800">
      {/* Basic Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Basic Details</h2>
        <form onSubmit={handleBasicSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={basic.name}
              onChange={(e) => setBasic({ ...basic, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={basic.email}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded bg-gray-100 cursor-not-allowed px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="target_score" className="block text-sm font-medium text-gray-700">
                Target Score
              </label>
              <input
                id="target_score"
                type="number"
                value={basic.target_score}
                onChange={(e) => setBasic({ ...basic, target_score: +e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="exam_date" className="block text-sm font-medium text-gray-700">
                Exam Date
              </label>
              <input
                id="exam_date"
                type="date"
                value={basic.exam_date || ""}
                onChange={(e) => setBasic({ ...basic, exam_date: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="previous_score" className="block text-sm font-medium text-gray-700">
              Previous Score
            </label>
            <input
              id="previous_score"
              type="number"
              value={basic.previous_score || ""}
              onChange={(e) => setBasic({ ...basic, previous_score: +e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Save Basic Details
          </button>
        </form>
      </div>

      {/* Notifications Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Notifications</h2>
        <form onSubmit={handleNotifySave} className="space-y-4">
          <div className="flex items-center">
            <input
              id="email_notifications"
              type="checkbox"
              checked={notify.notify_mail}
              onChange={(e) => setNotify({ ...notify, notify_mail: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="email_notifications" className="ml-2 text-sm font-medium text-gray-700">
              Email Notifications
            </label>
          </div>

          <div className="flex items-center text-gray-400">
            <input id="whatsapp_notifications" type="checkbox" checked={false} disabled className="h-4 w-4 border-gray-300 rounded" />
            <label htmlFor="whatsapp_notifications" className="ml-2 text-sm font-medium">
              WhatsApp Notifications <span className="italic">(Coming Soon)</span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Save Notification Settings
          </button>
        </form>
      </div>
    </div>
  );
}
