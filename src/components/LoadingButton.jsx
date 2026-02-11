const LoadingButton = ({
  isLoading,
  disabled,
  children,
  loadingText = "Processing...",
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`btn d-flex justify-content-center align-items-center ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>

          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
