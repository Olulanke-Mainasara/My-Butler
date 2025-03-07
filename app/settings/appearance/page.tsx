import { AppearanceForm } from "./appearance-form";

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-medium">Appearance</h3>
        <p className="opacity-70">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <hr />
      <AppearanceForm />
    </div>
  );
}
