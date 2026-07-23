export function SpinnerPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div role="status" aria-label="Loading" className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
    </div>
  );
}
