import { supabaseAdmin } from '../config/supabase';
import { ProjectInfo } from '../types';

class InfoService {
  async getProjectInfo(): Promise<ProjectInfo | null> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('project_info')
      .select('*')
      .single();

    if (error) {
      // If no project info exists, return default
      if (error.code === 'PGRST116') {
        return {
          id: '1',
          title: '위(Wee) 프로젝트',
          description: 'We(우리들) + Education(교육) + Emotion(감성)의 합성어로, 학생들의 건강하고 즐거운 학교생활을 위해 학교, 교육청, 지역사회가 연계하여 학생들의 학교생활 적응을 돕는 다중 통합지원 서비스망입니다.',
          vision: '모든 학생이 행복한 학교생활을 영위할 수 있는 교육환경 조성',
          mission: '학생 개개인의 특성과 요구에 맞는 맞춤형 상담 및 교육 서비스 제공',
          createdAt: new Date('2008-01-01'),
          updatedAt: new Date()
        };
      }
      throw error;
    }

    return this.mapToProjectInfo(data);
  }

  async updateProjectInfo(info: Partial<ProjectInfo>): Promise<ProjectInfo> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    // First, check if project info exists
    const { data: existing } = await supabaseAdmin
      .from('project_info')
      .select('id')
      .single();

    let result;

    if (existing) {
      // Update existing
      const { data, error } = await supabaseAdmin
        .from('project_info')
        .update({
          title: info.title,
          description: info.description,
          vision: info.vision,
          mission: info.mission,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabaseAdmin
        .from('project_info')
        .insert({
          title: info.title || '위(Wee) 프로젝트',
          description: info.description || 'We(우리들) + Education(교육) + Emotion(감성)의 합성어로, 학생들의 건강하고 즐거운 학교생활을 위해 학교, 교육청, 지역사회가 연계하여 학생들의 학교생활 적응을 돕는 다중 통합지원 서비스망입니다.',
          vision: info.vision || '모든 학생이 행복한 학교생활을 영위할 수 있는 교육환경 조성',
          mission: info.mission || '학생 개개인의 특성과 요구에 맞는 맞춤형 상담 및 교육 서비스 제공'
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return this.mapToProjectInfo(result);
  }

  private mapToProjectInfo(data: any): ProjectInfo {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      vision: data.vision,
      mission: data.mission,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

export default new InfoService();