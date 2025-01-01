import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getLeaderboard } from '../services/api';

interface LeaderboardEntry {
  _id: string;
  name: string;
  score: number;
  rank: number;
}

interface RootState {
  auth: {
    user: {
      _id: string;
    } | null;
  }
}

function ScoreBoard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className='w-full flex flex-col gap-10'>
      <div className='py-8 w-full text-center'>
        <h1 className='text-3xl font-bold'>Leaderboard</h1>
      </div>
      <div className="max-w-4xl mx-auto w-full px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rank</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Score</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {leaderboard.map((entry) => (
                <tr 
                  key={entry._id} 
                  className={`${entry._id === currentUser?._id ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      {entry.rank === 1 && <span className="text-2xl mr-2">🏆</span>}
                      {entry.rank === 2 && <span className="text-2xl mr-2">🥈</span>}
                      {entry.rank === 3 && <span className="text-2xl mr-2">🥉</span>}
                      <span className={entry.rank <= 3 ? 'font-bold' : ''}>{entry.rank}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='text-sm font-medium text-gray-900'>
                        {entry.name}
                        {entry._id === currentUser?._id && ' (You)'}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>{entry.score} points</div>
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={3} className='px-6 py-4 text-center text-gray-500'>
                    No scores available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;