"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating squares */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-accent/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-primary/10 blur-3xl animate-float-reverse" />
      <div className="absolute bottom-20 right-1/3 w-44 h-44 bg-accent/10 blur-3xl animate-float" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/5 blur-3xl animate-float-slow" />

      {/* Additional decorative squares */}
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-accent/10 blur-2xl animate-float-reverse" />
      <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-primary/10 blur-2xl animate-float" />

      {/* More floating squares for enhanced animation */}
      <div className="absolute top-1/3 left-1/5 w-20 h-20 bg-primary/10 blur-2xl animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/5 w-32 h-32 bg-accent/10 blur-3xl animate-float-reverse" />
    </div>
  )
}
