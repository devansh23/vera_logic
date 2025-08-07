import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

async function getUsers() {
  return await prisma.user.findMany({
    orderBy: { email: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      gmailConnected: true,
      gmailLastSynced: true,
    }
  });
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  // Simple admin check - you can make this more sophisticated
  if (!session?.user?.email || !session.user.email.includes('dev.devanshchaudhary@gmail.com')) {
    redirect('/');
  }

  const users = await getUsers();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Beta Users Dashboard</h1>
      
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.gmailConnected).length}
              </div>
              <div className="text-gray-600">Gmail Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.emailVerified && u.emailVerified > oneWeekAgo).length}
              </div>
              <div className="text-gray-600">Verified This Week</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Beta Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Gmail</th>
                  <th className="px-4 py-2 text-left">Last Sync</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">
                      <div className="flex items-center">
                        {user.image && (
                          <img 
                            src={user.image} 
                            alt={user.name || 'User'} 
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <span>{user.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.emailVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.gmailConnected 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.gmailConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {user.gmailLastSynced 
                        ? user.gmailLastSynced.toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 