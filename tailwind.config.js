export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: { 
      colors: {
        
        'light-background': '#f8fafc', 
        'light-text': '#0f172a',       
        'light-primary': '#2563eb',    
        'light-secondary': '#0ea5e9',  
        'light-card': '#ffffff',       

        
        'dark-background': '#0f172a',  
        'dark-text': '#f8fafc',        
        'dark-primary': '#3b82f6',     
        'dark-secondary': '#38bdf8',   
        'dark-card': '#1e293b',        

        
        'primary-accent': 'var(--color-primary-accent)',
        'secondary-accent': 'var(--color-secondary-accent)',
        'background': 'var(--color-background)',
        'text-primary': 'var(--color-text-primary)',
        'card-background': 'var(--color-card-background)',
      },
      
    }, 
  }, 
  plugins: [],
}