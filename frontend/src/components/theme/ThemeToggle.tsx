import { Component } from 'solid-js';
import { useTheme } from '../../hooks/useTheme';


const ThemeToggle: Component = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isDark()}
        class="sr-only"
        onChange={toggleTheme}
      />
      <div class="w-14 h-8 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-700 peer-checked:bg-blue-600 flex items-center justify-between px-1.5">
        <svg
          class={`h-5 w-5 text-yellow-500 transition-transform ${isDark() ? 'transform scale-0' : 'transform scale-100'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011-1h.001c.552 0 1 .447 1 1v.001c0 .552-.447 1-1 1H11a1 1 0 01-1-1V5zM3.22 6.78a1 1 0 011.41-1.41L5.88 7.45a1 1 0 01-1.41 1.41L3.22 6.78zM4 11a1 1 0 01-1 1h-.001a1 1 0 010-2H3a1 1 0 011 1zm10 0a1 1 0 011 1v.001a1 1 0 01-1 1h-.001a1 1 0 010-2H14zM15.29 5.29a1 1 0 011.41 0l1.25 1.25a1 1 0 01-1.41 1.41L15.29 6.7a1 1 0 010-1.41zM9 10a1 1 0 102 0 1 1 0 00-2 0zm6.78 3.78a1 1 0 011.41 1.41L15.88 16.7a1 1 0 01-1.41-1.41l1.25-1.25zM10 15a1 1 0 110 2h-.001a1 1 0 110-2H10z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          class={`h-5 w-5 text-blue-500 transition-transform ${isDark() ? 'transform scale-100' : 'transform scale-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M17.293 13.293a8 8 0 11-11.586 0 7.973 7.973 0 012.025-1.29 7.973 7.973 0 013.758 0 7.973 7.973 0 012.025 1.29zm-5.793-7.586a6.975 6.975 0 00-5.197 2.586 6.978 6.978 0 000 9.902 6.975 6.975 0 009.902 0 6.978 6.978 0 000-9.902 6.975 6.975 0 00-4.705-2.586z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </label>
  );
};

export default ThemeToggle;
