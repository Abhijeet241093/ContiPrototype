namespace Entities
{
    public class ServiceResult<T>
    {
        public bool IsSuccessful { get; set; }
        public T Data { get; set; }
        public string Message { get; set; }
        public ServiceResult(bool isSuccessful, T data, string message)
        {
            IsSuccessful = isSuccessful;
            Data = data;
            Message = message;
        }
    }
}
