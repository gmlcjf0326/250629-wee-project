import { supabaseAdmin } from '../config/supabase';
import { Service } from '../types';

class ServiceService {
  async getServices() {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  async getServiceById(id: string): Promise<Service | null> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert({
        name: service.name,
        description: service.description,
        category: service.category,
        features: service.features,
        is_active: service.isActive ?? true,
        order_index: service.order ?? 0
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.mapToService(data);
  }

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (service.name !== undefined) updateData.name = service.name;
    if (service.description !== undefined) updateData.description = service.description;
    if (service.category !== undefined) updateData.category = service.category;
    if (service.features !== undefined) updateData.features = service.features;
    if (service.isActive !== undefined) updateData.is_active = service.isActive;
    if (service.order !== undefined) updateData.order_index = service.order;

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.mapToService(data);
  }

  async deleteService(id: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not configured');
    }

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  private mapToService(data: any): Service {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      features: data.features,
      isActive: data.is_active,
      order: data.order_index,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

export default new ServiceService();