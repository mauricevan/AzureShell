using azure_portal_api.Models;

namespace azure_portal_api.Services
{
    public interface IUserService
    {
        Task<User> GetOrCreateUserAsync(string azureAdObjectId, string email, string displayName);
        Task<User?> GetUserByAzureAdIdAsync(string azureAdObjectId);
    }
}

