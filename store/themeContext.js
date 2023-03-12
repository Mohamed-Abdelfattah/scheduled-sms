// import React from 'react';

// const PreferencesContext = React.createContext({
//   toggleTheme: () => {},
//   isThemeDark: false,
// });

// export default function ThemeProvider({ children }) {
//   //
//   const [isThemeDark, setIsThemeDark] = React.useState(false);

//   let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

//   const toggleTheme = React.useCallback(() => {
//     return setIsThemeDark(!isThemeDark);
//   }, [isThemeDark]);

//   const preferences = React.useMemo(
//     () => ({
//       toggleTheme,
//       isThemeDark,
//     }),
//     [toggleTheme, isThemeDark]
//   );

//   return (
//     <PreferencesContext.Provider value={preferences}>
//       {children}
//     </PreferencesContext.Provider>
//   );
// }
