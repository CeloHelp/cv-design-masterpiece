
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, Palette, Clock } from 'lucide-react';
import { useStatistics } from '@/hooks/useStatistics';

const DESIGN_COLORS = {
  modern: '#3B82F6',
  classic: '#6B7280', 
  creative: '#8B5CF6',
} as const;

const COLORS = ['#3B82F6', '#6B7280', '#8B5CF6', '#10B981', '#F59E0B'];

const StatisticsCard: React.FC = () => {
  const { statistics, isLoading, error } = useStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Erro ao carregar estatísticas. Tente novamente mais tarde.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDesignName = (design: string) => {
    const names = {
      modern: 'Moderno',
      classic: 'Clássico',
      creative: 'Criativo',
    } as const;
    return names[design as keyof typeof names] || design;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const pieData = statistics.designsPopularity.map((item, index) => ({
    name: getDesignName(item.design),
    value: item.count,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de CVs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCVs}</div>
            <p className="text-xs text-muted-foreground">
              Na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seus CVs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.userStats.totalCVs}</div>
            <p className="text-xs text-muted-foreground">
              Criados por você
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Design Favorito</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getDesignName(statistics.userStats.mostUsedDesign)}</div>
            <p className="text-xs text-muted-foreground">
              Mais usado por você
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Última Atividade</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {statistics.userStats.lastActivity 
                ? formatDate(statistics.userStats.lastActivity)
                : 'Nunca'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Último CV editado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Designs Mais Populares */}
        <Card>
          <CardHeader>
            <CardTitle>Designs Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value, 'CVs']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Popularidade dos Designs */}
        <Card>
          <CardHeader>
            <CardTitle>Ranking de Designs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.designsPopularity.map((design, index) => (
                <div key={design.design} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{getDesignName(design.design)}</p>
                      <p className="text-sm text-gray-500">{design.count} CVs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{design.percentage}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${design.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividade Recente */}
      {statistics.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Atividade dos Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => formatDate(value)}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value as string)}
                    formatter={(value: number) => [value, 'CVs criados']}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatisticsCard;
